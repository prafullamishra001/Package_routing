const { z } = require('zod');

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'operator']).optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const parcelSchema = z.object({
  weight: z.number().positive('Weight must be a positive number'),
  value: z.number().positive('Value must be a positive number'),
  destinationCountry: z.string().min(1, 'Destination country is required'),
});

const batchUploadSchema = z.object({
  parcels: z.array(parcelSchema).min(1, 'At least one parcel is required'),
});

module.exports = {
  registerSchema,
  loginSchema,
  parcelSchema,
  batchUploadSchema,
};
