// Enhanced Routes API with comprehensive functionality
import express, { Request, Response, NextFunction, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireAdmin } from '../middleware/auth';
const { body, validationResult, param, query } = require('express-validator');

const router: Router = express.Router();
const prisma = new PrismaClient();

// Validation middleware
const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dados de entrada inválidos',
      errors: errors.array()
    });
  }
  next();
};

// GET /api/routes - Get all routes with optional filtering
router.get('/', [
  query('origin').optional().isString().trim(),
  query('destination').optional().isString().trim(),
  query('active').optional().isBoolean()
], validateRequest, async (req: Request, res: Response) => {
  try {
    const { origin, destination, active } = req.query;

    const whereClause: any = {};
    
    if (origin) {
      whereClause.originCity = {
        contains: origin as string,
        mode: 'insensitive'
      };
    }
    
    if (destination) {
      whereClause.destinationCity = {
        contains: destination as string,
        mode: 'insensitive'
      };
    }
    
    if (active !== undefined) {
      whereClause.isActive = active === 'true';
    }

    const routes = await prisma.route.findMany({
      where: whereClause,
      orderBy: [
        { originCity: 'asc' },
        { destinationCity: 'asc' }
      ],
      include: {
        trips: {
          where: {
            departureTime: {
              gte: new Date()
            },
            status: 'SCHEDULED'
          },
          take: 5,
          orderBy: {
            departureTime: 'asc'
          }
        }
      }
    });

    res.json({
      success: true,
      data: routes,
      count: routes.length
    });
  } catch (error) {
    console.error('Erro ao buscar rotas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao buscar rotas'
    });
  }
});

// GET /api/routes/:id - Get specific route
router.get('/:id', [
  param('id').isUUID().withMessage('ID da rota deve ser um UUID válido')
], validateRequest, async (req: Request, res: Response) => {
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
          orderBy: {
            departureTime: 'asc'
          },
          include: {
            bus: {
              select: {
                model: true,
                capacity: true,
                amenities: true
              }
            }
          }
        }
      }
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
      });
    }

    res.json({
      success: true,
      data: route
    });
  } catch (error) {
    console.error('Erro ao buscar rota:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao buscar rota'
    });
  }
});

// POST /api/routes - Create new route (Admin only)
router.post('/', authenticateToken, requireAdmin, [
  body('originCity')
    .notEmpty()
    .withMessage('Cidade de origem é obrigatória')
    .isLength({ min: 2, max: 100 })
    .withMessage('Cidade de origem deve ter entre 2 e 100 caracteres'),
  body('destinationCity')
    .notEmpty()
    .withMessage('Cidade de destino é obrigatória')
    .isLength({ min: 2, max: 100 })
    .withMessage('Cidade de destino deve ter entre 2 e 100 caracteres'),
  body('distance')
    .isInt({ min: 1 })
    .withMessage('Distância deve ser um número inteiro positivo'),
  body('estimatedDuration')
    .isInt({ min: 1 })
    .withMessage('Duração estimada deve ser um número inteiro positivo'),
  body('basePrice')
    .isFloat({ min: 0.01 })
    .withMessage('Preço base deve ser um número positivo')
], validateRequest, async (req: Request, res: Response) => {
  try {
    const { originCity, destinationCity, distance, estimatedDuration, basePrice } = req.body;

    // Check if route already exists
    const existingRoute = await prisma.route.findFirst({
      where: {
        originCity: {
          equals: originCity,
          mode: 'insensitive'
        },
        destinationCity: {
          equals: destinationCity,
          mode: 'insensitive'
        }
      }
    });

    if (existingRoute) {
      return res.status(400).json({
        success: false,
        message: 'Rota já existe entre essas cidades'
      });
    }

    const route = await prisma.route.create({
      data: {
        originCity,
        destinationCity,
        distance: parseInt(distance),
        estimatedDuration: parseInt(estimatedDuration),
        basePrice: parseFloat(basePrice)
      }
    });

    res.status(201).json({
      success: true,
      message: 'Rota criada com sucesso',
      data: route
    });
  } catch (error) {
    console.error('Erro ao criar rota:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao criar rota'
    });
  }
});

// PUT /api/routes/:id - Update route (Admin only)
router.put('/:id', authenticateToken, requireAdmin, [
  param('id').isUUID().withMessage('ID da rota deve ser um UUID válido'),
  body('originCity').optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Cidade de origem deve ter entre 2 e 100 caracteres'),
  body('destinationCity').optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Cidade de destino deve ter entre 2 e 100 caracteres'),
  body('distance').optional()
    .isInt({ min: 1 })
    .withMessage('Distância deve ser um número inteiro positivo'),
  body('estimatedDuration').optional()
    .isInt({ min: 1 })
    .withMessage('Duração estimada deve ser um número inteiro positivo'),
  body('basePrice').optional()
    .isFloat({ min: 0.01 })
    .withMessage('Preço base deve ser um número positivo'),
  body('isActive').optional()
    .isBoolean()
    .withMessage('Status ativo deve ser um valor booleano')
], validateRequest, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if route exists
    const existingRoute = await prisma.route.findUnique({
      where: { id }
    });

    if (!existingRoute) {
      return res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
      });
    }

    // Convert string numbers to appropriate types
    if (updateData.distance) updateData.distance = parseInt(updateData.distance);
    if (updateData.estimatedDuration) updateData.estimatedDuration = parseInt(updateData.estimatedDuration);
    if (updateData.basePrice) updateData.basePrice = parseFloat(updateData.basePrice);

    const route = await prisma.route.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Rota atualizada com sucesso',
      data: route
    });
  } catch (error) {
    console.error('Erro ao atualizar rota:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao atualizar rota'
    });
  }
});

// DELETE /api/routes/:id - Delete route (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, [
  param('id').isUUID().withMessage('ID da rota deve ser um UUID válido')
], validateRequest, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if route exists
    const existingRoute = await prisma.route.findUnique({
      where: { id },
      include: {
        trips: {
          where: {
            departureTime: {
              gte: new Date()
            }
          }
        }
      }
    });

    if (!existingRoute) {
      return res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
      });
    }

    // Check if there are future trips
    if (existingRoute.trips.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível excluir rota com viagens agendadas'
      });
    }

    await prisma.route.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Rota excluída com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir rota:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao excluir rota'
    });
  }
});

// GET /api/routes/popular - Get popular routes
router.get('/popular', async (req: Request, res: Response) => {
  try {
    const popularRoutes = await prisma.route.findMany({
      include: {
        trips: {
          include: {
            bookings: true
          }
        }
      }
    });

    // Calculate popularity based on booking count
    const routesWithStats = popularRoutes.map(route => {
      const totalBookings = route.trips.reduce((acc, trip) => {
        return acc + trip.bookings.length;
      }, 0);

      return {
        ...route,
        totalBookings,
        totalTrips: route.trips.length
      };
    });

    // Sort by popularity
    routesWithStats.sort((a, b) => b.totalBookings - a.totalBookings);

    res.json({
      success: true,
      data: routesWithStats.slice(0, 10) // Top 10 popular routes
    });
  } catch (error) {
    console.error('Erro ao buscar rotas populares:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao buscar rotas populares'
    });
  }
});

// GET /api/routes/search - Advanced route search
router.get('/search', [
  query('from').notEmpty().withMessage('Cidade de origem é obrigatória'),
  query('to').notEmpty().withMessage('Cidade de destino é obrigatória'),
  query('date').optional().isISO8601().withMessage('Data deve estar no formato ISO 8601'),
  query('passengers').optional().isInt({ min: 1, max: 10 }).withMessage('Número de passageiros deve ser entre 1 e 10')
], validateRequest, async (req: Request, res: Response) => {
  try {
    const { from, to, date, passengers = 1 } = req.query;

    const searchDate = date ? new Date(date as string) : new Date();
    const endDate = new Date(searchDate);
    endDate.setDate(endDate.getDate() + 1);

    const routes = await prisma.route.findMany({
      where: {
        originCity: {
          contains: from as string,
          mode: 'insensitive'
        },
        destinationCity: {
          contains: to as string,
          mode: 'insensitive'
        },
        isActive: true
      },
      include: {
        trips: {
          where: {
            departureTime: {
              gte: searchDate,
              lt: endDate
            },
            status: 'SCHEDULED',
            availableSeats: {
              gte: parseInt(passengers as string)
            }
          },
          orderBy: {
            departureTime: 'asc'
          },
          include: {
            bus: {
              select: {
                model: true,
                capacity: true,
                amenities: true
              }
            }
          }
        }
      }
    });

    // Filter routes that have available trips
    const availableRoutes = routes.filter(route => route.trips.length > 0);

    res.json({
      success: true,
      data: availableRoutes,
      searchParams: {
        from,
        to,
        date: searchDate,
        passengers
      }
    });
  } catch (error) {
    console.error('Erro ao pesquisar rotas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao pesquisar rotas'
    });
  }
});

export default router;
