# Bus Ticket Sales Application - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication using Bearer tokens in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "CUSTOMER"
    },
    "token": "jwt_token"
  }
}
```

#### POST /auth/login
Login an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET /auth/me
Get current user information. Requires authentication.

### Routes

#### GET /routes
Get all active routes.

#### GET /routes/search/cities
Search routes by origin and destination.

**Query Parameters:**
- `origin` (required): Origin city
- `destination` (required): Destination city
- `date` (optional): Travel date

### Trips

#### GET /trips
Get all upcoming trips.

#### POST /trips
Create a new trip. Requires admin authentication.

### Bookings

#### POST /bookings
Create a new booking. Requires authentication.

**Request Body:**
```json
{
  "tripId": "trip_id",
  "seatNumbers": [1, 2]
}
```

#### GET /bookings
Get user's bookings. Requires authentication.

### Payments

#### POST /payments/create-intent
Create a Stripe payment intent. Requires authentication.

**Request Body:**
```json
{
  "bookingId": "booking_id"
}
```

#### POST /payments/confirm
Confirm a payment. Requires authentication.

**Request Body:**
```json
{
  "paymentIntentId": "pi_xxx"
}
```

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
