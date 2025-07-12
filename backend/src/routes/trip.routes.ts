import express, { Router } from 'express';
import { prisma } from '../index';
import { protect, authorize } from '../middleware/auth.middleware';

const router: Router = express.Router();

// @desc    Get all trips
// @route   GET /api/trips
// @access  Public
router.get('/', async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      where: {
        departureTime: {
          gte: new Date()
        }
      },
      include: {
        route: true,
        bus: true
      },
      orderBy: { departureTime: 'asc' }
    });

    res.status(200).json({
      success: true,
      data: trips
    });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create trip
// @route   POST /api/trips
// @access  Private/Admin
router.post('/', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const { routeId, busId, departureTime, arrivalTime, price } = req.body;

    // Get bus capacity for available seats
    const bus = await prisma.bus.findUnique({
      where: { id: busId }
    });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    const trip = await prisma.trip.create({
      data: {
        routeId,
        busId,
        departureTime: new Date(departureTime),
        arrivalTime: new Date(arrivalTime),
        price,
        availableSeats: bus.capacity
      },
      include: {
        route: true,
        bus: true
      }
    });

    res.status(201).json({
      success: true,
      data: trip
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
