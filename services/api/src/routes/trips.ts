import { Router } from 'express';
import { z } from 'zod';
import { Types } from 'mongoose';
import { Trip } from '../models/Trip';
import { User } from '../models/User';
import { authenticateJwt, requireRole } from '../middleware/auth';
import { notificationService } from '../utils/notificationService';

const router = Router();

const createTripSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  categories: z.array(z.string()).default([]),
  destination: z.string().min(1),
  location: z.object({ coordinates: z.tuple([z.number(), z.number()]) }).optional(),
  schedule: z.array(z.object({ day: z.number(), title: z.string(), activities: z.array(z.string()).default([]) })).default([]),
  images: z.array(z.string()).default([]),
  capacity: z.number().int().positive(),
  price: z.number().positive(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

// Async error wrapper
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/', authenticateJwt, requireRole(['organizer','admin']), asyncHandler(async (req: any, res: any) => {
  try {
    // Enhanced validation with better error messages
    const parsed = createTripSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorMessages = Object.entries(parsed.error.flatten().fieldErrors)
        .map(([field, errors]) => `${field}: ${errors?.join(', ')}`)
        .join('; ');
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errorMessages,
        fields: parsed.error.flatten().fieldErrors
      });
    }
    
    const body = parsed.data;
    const organizerId = req.auth.userId;
    
    // Additional validation
    if (body.startDate >= body.endDate) {
      return res.status(400).json({ 
        error: 'End date must be after start date' 
      });
    }
    
    if (new Date(body.startDate) < new Date()) {
      return res.status(400).json({ 
        error: 'Start date cannot be in the past' 
      });
    }
    
    console.log('Creating trip:', {
      title: body.title,
      organizerId,
      destination: body.destination
    });
    
    // Create trip with timeout
    const createPromise = Trip.create({
      ...body, 
      organizerId, 
      location: body.location ? { type: 'Point', coordinates: body.location.coordinates } : undefined,
      participants: [],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database operation timeout')), 10000)
    );
    
    const trip = await Promise.race([createPromise, timeoutPromise]) as any;
    
    console.log('Trip created successfully:', trip._id);
    
    res.status(201).json({
      message: 'Trip created successfully',
      trip: {
        id: trip._id,
        title: trip.title,
        destination: trip.destination,
        price: trip.price,
        capacity: trip.capacity,
        startDate: trip.startDate,
        endDate: trip.endDate,
        categories: trip.categories
      }
    });
    
  } catch (error: any) {
    console.error('Error creating trip:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(409).json({ 
        error: 'Trip with this title already exists' 
      });
    }
    
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors)
        .map((err: any) => err.message)
        .join(', ');
      return res.status(400).json({ 
        error: 'Database validation failed',
        details: errorMessages
      });
    }
    
    if (error.message === 'Database operation timeout') {
      return res.status(503).json({ 
        error: 'Service temporarily unavailable. Please try again.' 
      });
    }
    
    // Generic error
    res.status(500).json({ 
      error: 'Failed to create trip. Please try again later.',
      ...(process.env.NODE_ENV !== 'production' && { details: error.message })
    });
  }
}));

router.get('/', async (req, res) => {
  const { q, category, minPrice, maxPrice, dest, from, to } = req.query as Record<string, string>;
  const filter: any = {};
  if (q) filter.$text = { $search: q };
  if (category) filter.categories = category;
  if (dest) filter.destination = dest;
  if (minPrice || maxPrice) filter.price = { ...(minPrice ? { $gte: Number(minPrice) } : {}), ...(maxPrice ? { $lte: Number(maxPrice) } : {}) };
  if (from || to) filter.startDate = { ...(from ? { $gte: new Date(from) } : {}), ...(to ? { $lte: new Date(to) } : {}) };
  const trips = await Trip.find(filter).lean().limit(50);
  res.json(trips);
});

router.get('/:id', async (req, res) => {
  const trip = await Trip.findById(req.params.id).lean();
  if (!trip) return res.status(404).json({ error: 'Not found' });
  res.json(trip);
});

router.post('/:id/join', authenticateJwt, async (req, res) => {
  try {
    const userId = (req as any).auth.userId;
    const trip = await Trip.findById(req.params.id).populate('organizerId', 'name');
    
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (trip.participants.length >= trip.capacity) {
      return res.status(400).json({ error: 'Trip is full' });
    }
    if (trip.participants.includes(userId)) {
      return res.status(400).json({ error: 'Already joined this trip' });
    }
    
    // Get traveler info for notification
    const traveler = await User.findById(userId);
    if (!traveler) return res.status(404).json({ error: 'User not found' });
    
    trip.participants.push(userId);
    await trip.save();
    
    // Send notification to organizer
    await notificationService.notifyTripJoin(
      trip._id as Types.ObjectId,
      traveler.name,
      new Types.ObjectId(userId)
    );
    
    res.json({ 
      message: 'Successfully joined trip', 
      trip: {
        id: trip._id,
        title: trip.title,
        participantCount: trip.participants.length,
        capacity: trip.capacity
      }
    });
  } catch (error) {
    console.error('Error joining trip:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id/leave', authenticateJwt, async (req, res) => {
  try {
    const userId = (req as any).auth.userId;
    const trip = await Trip.findById(req.params.id).populate('organizerId', 'name');
    
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (!trip.participants.includes(userId)) {
      return res.status(400).json({ error: 'Not part of this trip' });
    }
    
    // Get traveler info for notification
    const traveler = await User.findById(userId);
    if (!traveler) return res.status(404).json({ error: 'User not found' });
    
    // Remove participant
    trip.participants = trip.participants.filter(id => id.toString() !== userId);
    
    // Also remove from participantDetails if exists
    trip.participantDetails = trip.participantDetails.filter(
      detail => detail.userId.toString() !== userId
    );
    
    await trip.save();
    
    // Send notification to organizer
    await notificationService.notifyTripLeave(
      trip._id as Types.ObjectId,
      traveler.name,
      new Types.ObjectId(userId)
    );
    
    res.json({ 
      message: 'Successfully left trip',
      trip: {
        id: trip._id,
        title: trip.title,
        participantCount: trip.participants.length,
        capacity: trip.capacity
      }
    });
  } catch (error) {
    console.error('Error leaving trip:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update trip endpoint
router.put('/:id', authenticateJwt, requireRole(['organizer','admin']), async (req, res) => {
  try {
    const userId = (req as any).auth.userId;
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    
    // Check if user is the organizer or admin
    if (trip.organizerId.toString() !== userId && (req as any).auth.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this trip' });
    }
    
    // Create update schema (similar to create but all fields optional)
    const updateTripSchema = z.object({
      title: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      categories: z.array(z.string()).optional(),
      destination: z.string().min(1).optional(),
      location: z.object({ coordinates: z.tuple([z.number(), z.number()]) }).optional(),
      schedule: z.array(z.object({ day: z.number(), title: z.string(), activities: z.array(z.string()).default([]) })).optional(),
      images: z.array(z.string()).optional(),
      capacity: z.number().int().positive().optional(),
      price: z.number().positive().optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      itinerary: z.string().optional(),
      coverImage: z.string().optional(),
      itineraryPdf: z.string().optional(),
      status: z.enum(['active', 'cancelled', 'completed']).optional()
    });
    
    const parsed = updateTripSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    
    const updateData = parsed.data;
    
    // Handle location transformation if provided
    if (updateData.location) {
      (updateData as any).location = { type: 'Point', coordinates: updateData.location.coordinates };
    }
    
    // Update the trip
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json(updatedTrip);
  } catch (error: any) {
    console.error('Error updating trip:', error);
    res.status(500).json({ error: 'Failed to update trip' });
  }
});

// Delete trip endpoint
router.delete('/:id', authenticateJwt, requireRole(['organizer','admin']), async (req, res) => {
  try {
    const userId = (req as any).auth.userId;
    const trip = await Trip.findById(req.params.id).populate('organizerId', 'name');
    
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    
    // Check if user is the organizer or admin
    if (trip.organizerId._id.toString() !== userId && (req as any).auth.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this trip' });
    }
    
    // Store trip data for notifications before deletion
    const tripTitle = trip.title;
    const participantIds = [...trip.participants];
    const organizerName = ((trip.organizerId as any)?.name) || 'Organizer';
    
    // Delete the trip
    await Trip.findByIdAndDelete(req.params.id);
    
    // Notify all participants about trip deletion
    if (participantIds.length > 0) {
      await notificationService.notifyTripDeleted(
        trip._id as Types.ObjectId,
        tripTitle,
        participantIds.map(id => new Types.ObjectId(id)),
        organizerName
      );
    }
    
    res.json({ 
      message: 'Trip deleted successfully',
      notifiedParticipants: participantIds.length
    });
  } catch (error: any) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

export default router;


