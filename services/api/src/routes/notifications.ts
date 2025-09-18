import { Router } from 'express';
import { z } from 'zod';
import { authenticateJwt } from '../middleware/auth';
import { notificationService } from '../utils/notificationService';
import { Types } from 'mongoose';

const router = Router();

// Async error wrapper
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Get user notifications with pagination
router.get('/', authenticateJwt, asyncHandler(async (req: any, res: any) => {
  try {
    const userId = new Types.ObjectId(req.auth.userId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const result = await notificationService.getUserNotifications(userId, page, limit);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ 
      error: 'Failed to fetch notifications',
      details: error.message 
    });
  }
}));

// Get unread notification count
router.get('/unread-count', authenticateJwt, asyncHandler(async (req: any, res: any) => {
  try {
    const userId = new Types.ObjectId(req.auth.userId);
    const unreadCount = await notificationService.getUnreadCount(userId);
    
    res.json({
      success: true,
      unreadCount
    });
  } catch (error: any) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ 
      error: 'Failed to fetch unread count',
      details: error.message 
    });
  }
}));

// Mark notifications as read
const markAsReadSchema = z.object({
  notificationIds: z.array(z.string()).min(1, 'At least one notification ID is required')
});

router.put('/mark-read', authenticateJwt, asyncHandler(async (req: any, res: any) => {
  try {
    const parsed = markAsReadSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors
      });
    }
    
    const { notificationIds } = parsed.data;
    const userId = req.auth.userId;
    
    // Convert string IDs to ObjectIds and verify ownership
    const objectIds = notificationIds.map(id => {
      try {
        return new Types.ObjectId(id);
      } catch (error) {
        throw new Error(`Invalid notification ID: ${id}`);
      }
    });
    
    // Verify that all notifications belong to the requesting user
    const { Notification } = await import('../models/Notification');
    const notifications = await Notification.find({
      _id: { $in: objectIds },
      userId: new Types.ObjectId(userId)
    });
    
    if (notifications.length !== objectIds.length) {
      return res.status(403).json({ 
        error: 'Some notifications do not belong to you or do not exist'
      });
    }
    
    await notificationService.markAsRead(objectIds);
    
    res.json({
      success: true,
      message: `${objectIds.length} notifications marked as read`
    });
  } catch (error: any) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({ 
      error: 'Failed to mark notifications as read',
      details: error.message 
    });
  }
}));

// Mark all notifications as read for user
router.put('/mark-all-read', authenticateJwt, asyncHandler(async (req: any, res: any) => {
  try {
    const userId = new Types.ObjectId(req.auth.userId);
    
    const { Notification } = await import('../models/Notification');
    const result = await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );
    
    res.json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`
    });
  } catch (error: any) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ 
      error: 'Failed to mark all notifications as read',
      details: error.message 
    });
  }
}));

// Delete notification
router.delete('/:id', authenticateJwt, asyncHandler(async (req: any, res: any) => {
  try {
    const notificationId = req.params.id;
    const userId = req.auth.userId;
    
    if (!Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ error: 'Invalid notification ID' });
    }
    
    const { Notification } = await import('../models/Notification');
    const notification = await Notification.findOne({
      _id: notificationId,
      userId: new Types.ObjectId(userId)
    });
    
    if (!notification) {
      return res.status(404).json({ 
        error: 'Notification not found or does not belong to you' 
      });
    }
    
    await Notification.findByIdAndDelete(notificationId);
    
    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ 
      error: 'Failed to delete notification',
      details: error.message 
    });
  }
}));

// Test notification endpoint (for development/testing)
router.post('/test', authenticateJwt, asyncHandler(async (req: any, res: any) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Test endpoint not available in production' });
  }
  
  try {
    const userId = new Types.ObjectId(req.auth.userId);
    
    await notificationService.createNotification({
      userId,
      type: 'system',
      title: 'Test Notification',
      message: 'This is a test notification to verify the system is working correctly.',
      data: {
        testData: 'Hello World!'
      },
      sendEmail: false
    });
    
    res.json({
      success: true,
      message: 'Test notification created successfully'
    });
  } catch (error: any) {
    console.error('Error creating test notification:', error);
    res.status(500).json({ 
      error: 'Failed to create test notification',
      details: error.message 
    });
  }
}));

export default router;
