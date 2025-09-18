import { Notification, NotificationType } from '../models/Notification';
import { User } from '../models/User';
import { Trip } from '../models/Trip';
import { Types } from 'mongoose';
import nodemailer from 'nodemailer';

// Email configuration
const createEmailTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

interface NotificationData {
  userId: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  data?: {
    tripId?: Types.ObjectId;
    actorId?: Types.ObjectId;
    actorName?: string;
    tripTitle?: string;
    [key: string]: any;
  };
  sendEmail?: boolean;
}

class NotificationService {
  private emailTransporter: any;
  private socketIO: any;

  constructor() {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.emailTransporter = createEmailTransporter();
    }
  }

  // Set Socket.IO instance for real-time notifications
  setSocketIO(io: any) {
    this.socketIO = io;
  }

  // Create and send notification
  async createNotification(notificationData: NotificationData) {
    try {
      // Create notification in database
      const notification = await Notification.create({
        userId: notificationData.userId,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        data: notificationData.data || {},
        read: false,
        emailSent: false
      });

      // Send real-time notification via Socket.IO
      if (this.socketIO) {
        this.socketIO.to(`user_${notificationData.userId}`).emit('new_notification', {
          id: notification._id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          createdAt: notification.createdAt
        });
      }

      // Send email notification if requested and configured
      if (notificationData.sendEmail && this.emailTransporter) {
        await this.sendEmailNotification(notification);
      }

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Send email notification
  private async sendEmailNotification(notification: any) {
    try {
      const user = await User.findById(notification.userId);
      if (!user) return;

      const emailContent = this.generateEmailContent(notification);
      
      await this.emailTransporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@trekktrjbe.com',
        to: user.email,
        subject: notification.title,
        html: emailContent
      });

      // Mark email as sent
      await Notification.findByIdAndUpdate(notification._id, { emailSent: true });
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  }

  // Generate HTML email content
  private generateEmailContent(notification: any): string {
    const baseStyle = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #2563eb; margin-bottom: 16px;">${notification.title}</h2>
          <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">${notification.message}</p>
    `;

    let actionButton = '';
    if (notification.data?.tripId) {
      actionButton = `
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/trips/${notification.data.tripId}" 
           style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Trip
        </a>
      `;
    }

    const footer = `
        ${actionButton}
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>This is an automated message from Trek Tribe. Please do not reply to this email.</p>
        </div>
      </div>
    </div>
    `;

    return baseStyle + footer;
  }

  // Notification helper methods for different trip events
  async notifyTripJoin(tripId: Types.ObjectId, travelerName: string, travelerId: Types.ObjectId) {
    try {
      const trip = await Trip.findById(tripId).populate('organizerId', 'name email');
      if (!trip) return;

      await this.createNotification({
        userId: trip.organizerId._id,
        type: 'trip_join',
        title: 'New Traveler Joined Your Trip',
        message: `${travelerName} has joined your trip "${trip.title}". You now have ${trip.participants.length} participants.`,
        data: {
          tripId: trip._id,
          actorId: travelerId,
          actorName: travelerName,
          tripTitle: trip.title
        },
        sendEmail: true
      });
    } catch (error) {
      console.error('Error notifying trip join:', error);
    }
  }

  async notifyTripLeave(tripId: Types.ObjectId, travelerName: string, travelerId: Types.ObjectId) {
    try {
      const trip = await Trip.findById(tripId).populate('organizerId', 'name email');
      if (!trip) return;

      await this.createNotification({
        userId: trip.organizerId._id,
        type: 'trip_leave',
        title: 'Traveler Left Your Trip',
        message: `${travelerName} has left your trip "${trip.title}". You now have ${trip.participants.length} participants.`,
        data: {
          tripId: trip._id,
          actorId: travelerId,
          actorName: travelerName,
          tripTitle: trip.title
        },
        sendEmail: true
      });
    } catch (error) {
      console.error('Error notifying trip leave:', error);
    }
  }

  async notifyTripDeleted(tripId: Types.ObjectId, tripTitle: string, participantIds: Types.ObjectId[], organizerName: string) {
    try {
      const notifications = participantIds.map(participantId => ({
        userId: participantId,
        type: 'trip_delete' as NotificationType,
        title: 'Trip Cancelled',
        message: `The trip "${tripTitle}" has been cancelled by the organizer ${organizerName}. We apologize for any inconvenience.`,
        data: {
          tripId,
          tripTitle,
          actorName: organizerName
        },
        sendEmail: true
      }));

      // Create all notifications
      await Promise.all(notifications.map(notificationData => 
        this.createNotification(notificationData)
      ));
    } catch (error) {
      console.error('Error notifying trip deletion:', error);
    }
  }

  async notifyTripUpdate(tripId: Types.ObjectId, tripTitle: string, participantIds: Types.ObjectId[], organizerName: string, changes: string[]) {
    try {
      const changesList = changes.join(', ');
      const notifications = participantIds.map(participantId => ({
        userId: participantId,
        type: 'trip_update' as NotificationType,
        title: 'Trip Updated',
        message: `The trip "${tripTitle}" has been updated by ${organizerName}. Changes: ${changesList}`,
        data: {
          tripId,
          tripTitle,
          actorName: organizerName,
          changes: changes
        },
        sendEmail: false // Don't email for updates unless major changes
      }));

      await Promise.all(notifications.map(notificationData => 
        this.createNotification(notificationData)
      ));
    } catch (error) {
      console.error('Error notifying trip update:', error);
    }
  }

  // Get unread notification count for a user
  async getUnreadCount(userId: Types.ObjectId): Promise<number> {
    return await Notification.countDocuments({ userId, read: false });
  }

  // Mark notifications as read
  async markAsRead(notificationIds: Types.ObjectId[]): Promise<void> {
    await Notification.updateMany(
      { _id: { $in: notificationIds } },
      { read: true }
    );
  }

  // Get user notifications with pagination
  async getUserNotifications(userId: Types.ObjectId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Notification.countDocuments({ userId });
    const unreadCount = await this.getUnreadCount(userId);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      unreadCount
    };
  }
}

export const notificationService = new NotificationService();
