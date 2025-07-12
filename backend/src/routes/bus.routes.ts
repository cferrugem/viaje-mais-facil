import express, { Router } from 'express';
import { prisma } from '../index';
import { protect, authorize } from '../middleware/auth.middleware';

const router: Router = express.Router();

// @desc    Get all buses
// @route   GET /api/buses
// @access  Private/Admin
router.get('/', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const buses = await prisma.bus.findMany({
      orderBy: { plateNumber: 'asc' }
    });

    res.status(200).json({
      success: true,
      data: buses
    });
  } catch (error) {
    console.error('Get buses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create bus
// @route   POST /api/buses
// @access  Private/Admin
router.post('/', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const { plateNumber, model, capacity, amenities } = req.body;

    const bus = await prisma.bus.create({
      data: {
        plateNumber,
        model,
        capacity,
        amenities
      }
    });

    res.status(201).json({
      success: true,
      data: bus
    });
  } catch (error) {
    console.error('Create bus error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
