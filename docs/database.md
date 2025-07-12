# Database Schema

## Overview
The bus ticket booking system uses PostgreSQL as the primary database with Prisma as the ORM.

## Tables

### Users
Stores user information and authentication data.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| email | String | Unique email address |
| password | String | Hashed password |
| firstName | String | User's first name |
| lastName | String | User's last name |
| phoneNumber | String? | Optional phone number |
| isVerified | Boolean | Email verification status |
| role | UserRole | User role (CUSTOMER, ADMIN, DRIVER) |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Routes
Defines bus routes between cities.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| originCity | String | Departure city |
| destinationCity | String | Arrival city |
| distance | Float | Distance in kilometers |
| estimatedDuration | Int | Duration in minutes |
| basePrice | Float | Base ticket price |
| isActive | Boolean | Route availability status |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Constraints:**
- Unique combination of (originCity, destinationCity)

### Buses
Bus fleet information.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| plateNumber | String | Unique plate number |
| model | String | Bus model |
| capacity | Int | Seating capacity |
| amenities | String[] | Available amenities |
| isActive | Boolean | Bus availability status |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Trips
Scheduled bus trips.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| routeId | String | Foreign key to Routes |
| busId | String | Foreign key to Buses |
| departureTime | DateTime | Scheduled departure |
| arrivalTime | DateTime | Scheduled arrival |
| price | Float | Trip price |
| availableSeats | Int | Available seats count |
| status | TripStatus | Trip status |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Bookings
Customer ticket bookings.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| userId | String | Foreign key to Users |
| tripId | String | Foreign key to Trips |
| seatNumbers | Int[] | Booked seat numbers |
| totalAmount | Float | Total booking amount |
| status | BookingStatus | Booking status |
| bookingCode | String | Unique booking reference |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Payments
Payment transaction records.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| bookingId | String | Foreign key to Bookings |
| userId | String | Foreign key to Users |
| amount | Float | Payment amount |
| currency | String | Payment currency |
| stripePaymentId | String? | Stripe payment ID |
| stripeIntentId | String? | Stripe payment intent ID |
| status | PaymentStatus | Payment status |
| paymentMethod | String? | Payment method used |
| processedAt | DateTime? | Payment processing timestamp |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last update timestamp |

## Enums

### UserRole
- `CUSTOMER` - Regular customer
- `ADMIN` - System administrator
- `DRIVER` - Bus driver

### TripStatus
- `SCHEDULED` - Trip is scheduled
- `IN_TRANSIT` - Trip is in progress
- `COMPLETED` - Trip completed
- `CANCELLED` - Trip cancelled
- `DELAYED` - Trip delayed

### BookingStatus
- `PENDING` - Booking pending payment
- `CONFIRMED` - Booking confirmed
- `CANCELLED` - Booking cancelled
- `REFUNDED` - Booking refunded

### PaymentStatus
- `PENDING` - Payment pending
- `COMPLETED` - Payment successful
- `FAILED` - Payment failed
- `REFUNDED` - Payment refunded

## Relationships

- Users → Bookings (1:N)
- Users → Payments (1:N)
- Routes → Trips (1:N)
- Buses → Trips (1:N)
- Trips → Bookings (1:N)
- Bookings → Payments (1:N)

## Indexes

Primary indexes are automatically created for:
- Primary keys (id fields)
- Unique constraints (email, plateNumber, bookingCode)
- Unique composite keys (originCity + destinationCity)

Additional indexes should be considered for:
- Foreign key fields for join performance
- Frequently queried timestamp fields
- Search fields (city names)
