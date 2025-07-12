import express, { Router } from 'express';
import { prisma } from '../index';
import { protect } from '../middleware/auth.middleware';

const router: Router = express.Router();

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, async (req: any, res) => {
  try {
    const { tripId, seatNumbers } = req.body;
    const userId = req.user.id;

    // Get trip details
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { route: true, bus: true }
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check if seats are available
    if (Number(trip.availableSeats) < Number(seatNumbers.length)) {
      return res.status(400).json({
        success: false,
        message: 'Not enough available seats'
      });
    }

    // Calculate total amount
    const totalAmount = Number(trip.price) * Number(seatNumbers.length);

    // Generate booking code
    const bookingCode = `BUS${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        tripId,
        seatNumbers,
        totalAmount,
        bookingCode
      },
      include: {
        trip: {
          include: {
            route: true,
            bus: true
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Update available seats
    await prisma.trip.update({
      where: { id: tripId },
      data: {
        availableSeats: Number(trip.availableSeats) - Number(seatNumbers.length)
      }
    });

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
router.get('/', protect, async (req: any, res) => {
  try {
    const userId = req.user.id;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        trip: {
          include: {
            route: true,
            bus: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
