import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type NotificationType = 'trip_join' | 'trip_leave' | 'trip_update' | 'trip_delete' | 'trip_reminder' | 'system';

export interface NotificationDocument extends Document {
  userId: Types.ObjectId; // Recipient of the notification
  type: NotificationType;
  title: string;
  message: string;
  data?: {
    tripId?: Types.ObjectId;
    actorId?: Types.ObjectId; // User who triggered the notification
    actorName?: string;
    tripTitle?: string;
    [key: string]: any;
  };
  read: boolean;
  emailSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<NotificationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { 
      type: String, 
      enum: ['trip_join', 'trip_leave', 'trip_update', 'trip_delete', 'trip_reminder', 'system'], 
      required: true,
      index: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: {
      tripId: { type: Schema.Types.ObjectId, ref: 'Trip' },
      actorId: { type: Schema.Types.ObjectId, ref: 'User' },
      actorName: String,
      tripTitle: String,
      // Additional flexible data
      type: Schema.Types.Mixed
    },
    read: { type: Boolean, default: false, index: true },
    emailSent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Index for efficient queries
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ createdAt: -1 });

export const Notification: Model<NotificationDocument> = 
  mongoose.models.Notification || mongoose.model<NotificationDocument>('Notification', notificationSchema);
