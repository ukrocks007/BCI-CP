/**
 * Main server entry point
 * 
 * Initializes Express server with all routes and middleware
 */

import express from 'express';
import cors from 'cors';
import eegRoutes from './routes/eegRoutes';
import sessionRoutes from './routes/sessionRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/eeg', eegRoutes);
app.use('/api/sessions', sessionRoutes);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🧠 BCI Backend Server Running`);
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
  console.log(`\n✅ Ready to receive EEG signals and BCI requests`);
});

export default app;
