import express from 'express';
import cors from 'cors';
import { parseAppointment, upload } from './controllers/appointment.controller';
import { apiRateLimiter } from './middleware/rateLimiter';

const app = express();

app.use(cors());
app.use(express.json());

// Apply rate limiting to all API routes
app.use('/api', apiRateLimiter);

// Routes
app.post('/api/v1/parse', upload.single('image'), parseAppointment);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
