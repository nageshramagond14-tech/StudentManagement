/**
 * Server Entry Point
 *
 * WHY connect to DB first, THEN start listening?
 *   - If we start the server before the DB is connected, incoming
 *     requests will fail because there's no database to query.
 *   - By awaiting connectDB(), we guarantee the database is ready
 *     before accepting any HTTP requests.
 *
 * WHY is dotenv loaded in app.js?
 *   - `require('./app')` runs app.js first, which calls dotenv.config()
 *   - This ensures process.env.MONGO_URI is available by the time
 *     connectDB() runs below.
 */

const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config');

const PORT = config.port;

// ── Start the server only AFTER database is connected ───────────
const startServer = async () => {
  // Step 1: Connect to MongoDB (exits process on failure)
  await connectDB();

  // Step 2: Start Express HTTP server
  app.listen(PORT, () => {
    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log(`  🚀 Server running on port ${PORT}`);
    console.log(`  📡 API Base: http://localhost:${PORT}/api/students`);
    console.log(`  🌍 Environment: ${config.nodeEnv}`);
    console.log('═══════════════════════════════════════════');
    console.log('');
  });
};

startServer();