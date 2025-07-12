import express, { Router } from 'express';
import { prisma } from '../index';
import { protect, authorize } from '../middleware/auth.middleware';

const router: Router = express.Router();

// @desc    Get all routes
// @route   GET /api/routes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const routes = await prisma.route.findMany({
      where: { isActive: true },
      orderBy: { originCity: 'asc' }
    });

    res.status(200).json({
      success: true,
      data: routes
    });
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get route by ID
// @route   GET /api/routes/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const route = await prisma.route.findUnique({
      where: { id },
      include: {
        trips: {
          where: {
            departureTime: {
              gte: new Date()
            }
          },
          include: {
            bus: true
          },
          orderBy: { departureTime: 'asc' }
        }
      }
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    res.status(200).json({
      success: true,
      data: route
    });
  } catch (error) {
    console.error('Get route error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create route
// @route   POST /api/routes
// @access  Private/Admin
router.post('/', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const { originCity, destinationCity, distance, estimatedDuration, basePrice } = req.body;

    const route = await prisma.route.create({
      data: {
        originCity,
        destinationCity,
        distance,
        estimatedDuration,
        basePrice
      }
    });

    res.status(201).json({
      success: true,
      data: route
    });
  } catch (error) {
    console.error('Create route error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update route
// @route   PUT /api/routes/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { originCity, destinationCity, distance, estimatedDuration, basePrice, isActive } = req.body;

    const route = await prisma.route.update({
      where: { id },
      data: {
        originCity,
        destinationCity,
        distance,
        estimatedDuration,
        basePrice,
        isActive
      }
    });

    res.status(200).json({
      success: true,
      data: route
    });
  } catch (error) {
    console.error('Update route error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete route
// @route   DELETE /api/routes/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.route.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Route deleted successfully'
    });
  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Search routes
// @route   GET /api/routes/search
// @access  Public
router.get('/search/cities', async (req, res) => {
  try {
    const { origin, destination, date } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Origin and destination are required'
      });
    }

    const routes = await prisma.route.findMany({
      where: {
        originCity: {
          contains: origin as string,
          mode: 'insensitive'
        },
        destinationCity: {
          contains: destination as string,
          mode: 'insensitive'
        },
        isActive: true
      },
      include: {
        trips: {
          where: date ? {
            departureTime: {
              gte: new Date(date as string),
              lt: new Date(new Date(date as string).getTime() + 24 * 60 * 60 * 1000)
            }
          } : {
            departureTime: {
              gte: new Date()
            }
          },
          include: {
            bus: true
          },
          orderBy: { departureTime: 'asc' }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: routes
    });
  } catch (error) {
    console.error('Search routes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
