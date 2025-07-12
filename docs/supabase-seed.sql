-- Sample data for Bus Ticket Application
-- Execute AFTER creating the schema

-- Insert sample users (passwords are hashed with bcrypt)
INSERT INTO users (id, email, password, first_name, last_name, phone_number, is_verified, role) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@bustickets.com', '$2a$12$LQv3c1yqBw4Q8.KLMi/I2.ZAGSdyYC4ZJ4Y9xZJKP8Q3hVZzxTcSa', 'Admin', 'User', '+1234567890', true, 'ADMIN'),
('550e8400-e29b-41d4-a716-446655440002', 'customer@example.com', '$2a$12$LQv3c1yqBw4Q8.KLMi/I2.ZAGSdyYC4ZJ4Y9xZJKP8Q3hVZzxTcSa', 'John', 'Doe', '+1987654321', true, 'CUSTOMER'),
('550e8400-e29b-41d4-a716-446655440003', 'driver@bustickets.com', '$2a$12$LQv3c1yqBw4Q8.KLMi/I2.ZAGSdyYC4ZJ4Y9xZJKP8Q3hVZzxTcSa', 'Mike', 'Johnson', '+1555666777', true, 'DRIVER');

-- Insert sample routes
INSERT INTO routes (id, origin_city, destination_city, distance, estimated_duration, base_price) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'New York', 'Washington DC', 225.50, 240, 45.00),
('660e8400-e29b-41d4-a716-446655440002', 'Los Angeles', 'San Francisco', 382.00, 360, 65.00),
('660e8400-e29b-41d4-a716-446655440003', 'Chicago', 'Detroit', 282.00, 300, 55.00),
('660e8400-e29b-41d4-a716-446655440004', 'Miami', 'Orlando', 235.00, 180, 35.00),
('660e8400-e29b-41d4-a716-446655440005', 'Boston', 'New York', 215.00, 210, 40.00);

-- Insert sample buses
INSERT INTO buses (id, plate_number, model, capacity, amenities, maintenance_due) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'BUS001', 'Mercedes Sprinter', 45, ARRAY['WiFi', 'AC', 'USB Charging', 'Reclining Seats'], '2025-09-01'),
('770e8400-e29b-41d4-a716-446655440002', 'BUS002', 'Volvo B12R', 50, ARRAY['WiFi', 'AC', 'USB Charging', 'Entertainment System'], '2025-08-15'),
('770e8400-e29b-41d4-a716-446655440003', 'BUS003', 'Scania Touring', 48, ARRAY['WiFi', 'AC', 'USB Charging', 'Reclining Seats', 'Onboard Toilet'], '2025-07-30'),
('770e8400-e29b-41d4-a716-446655440004', 'BUS004', 'MAN Lion''s Coach', 52, ARRAY['WiFi', 'AC', 'USB Charging', 'Entertainment System', 'Leather Seats'], '2025-10-10');

-- Insert sample trips (future dates)
INSERT INTO trips (id, route_id, bus_id, departure_time, arrival_time, price, available_seats) VALUES
-- Tomorrow's trips
('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 
 NOW() + INTERVAL '1 day' + TIME '08:00', NOW() + INTERVAL '1 day' + TIME '12:00', 45.00, 45),
('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 
 NOW() + INTERVAL '1 day' + TIME '14:00', NOW() + INTERVAL '1 day' + TIME '20:00', 65.00, 50),

-- Day after tomorrow's trips
('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', 
 NOW() + INTERVAL '2 days' + TIME '09:00', NOW() + INTERVAL '2 days' + TIME '14:00', 55.00, 48),
('880e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440004', 
 NOW() + INTERVAL '2 days' + TIME '16:00', NOW() + INTERVAL '2 days' + TIME '19:00', 35.00, 52),

-- Next week's trips
('880e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440001', 
 NOW() + INTERVAL '7 days' + TIME '07:30', NOW() + INTERVAL '7 days' + TIME '11:00', 40.00, 45);

-- Insert sample promocodes
INSERT INTO promocodes (id, code, description, discount_type, discount_value, min_amount, max_discount, usage_limit, valid_from, valid_until) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'WELCOME10', 'Welcome discount for new users', 'PERCENTAGE', 10.00, 30.00, 15.00, 100, NOW(), NOW() + INTERVAL '30 days'),
('990e8400-e29b-41d4-a716-446655440002', 'SUMMER20', 'Summer vacation special', 'PERCENTAGE', 20.00, 50.00, 25.00, 50, NOW(), NOW() + INTERVAL '60 days'),
('990e8400-e29b-41d4-a716-446655440003', 'FIXED5', 'Fixed $5 discount', 'FIXED_AMOUNT', 5.00, 25.00, 5.00, 200, NOW(), NOW() + INTERVAL '90 days');

-- Sample booking (using generate_booking_code function)
INSERT INTO bookings (id, user_id, trip_id, seat_numbers, total_amount, booking_code, status) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', 
 ARRAY[15, 16], 90.00, generate_booking_code(), 'CONFIRMED');

-- Sample payment for the booking
INSERT INTO payments (id, booking_id, user_id, amount, status, processed_at) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 
 90.00, 'COMPLETED', NOW());

-- Sample notification
INSERT INTO notifications (id, user_id, title, message, type) VALUES
('cc0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 
 'Booking Confirmed', 'Your booking for New York to Washington DC has been confirmed!', 'SUCCESS');

-- Update available seats for the booked trip
UPDATE trips SET available_seats = available_seats - 2 WHERE id = '880e8400-e29b-41d4-a716-446655440001';
