const mongoose = require('mongoose');
const config = require('./index');

/**
 * @desc    Connect to MongoDB Atlas using Mongoose
 * @details Uses MONGO_URI from .env file. Exits process on failure
 *          to prevent the app from running without a database.
 *
 * WHY process.exit(1)?
 *   - If the database is unreachable, the API cannot serve any data.
 *   - Silently continuing would cause every request to fail with
 *     cryptic errors, making debugging much harder.
 *   - In production, a process manager (PM2, Docker) will restart
 *     the app automatically, giving it a chance to reconnect.
 */
const connectDB = async () => {
  try {
    // ── Step 1: Validate that the URI exists ──────────────────────
    const uri = config.mongoUri;

    if (!uri) {
      console.error('❌ FATAL: MONGO_URI is not defined in .env file!');
      console.error('   → Create a .env file in the project root');
      console.error('   → Add: MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/<dbname>');
      process.exit(1);
    }

    // ── Step 2: Configure Mongoose options ────────────────────────
    // These options ensure stable connections and proper error handling
    const options = {
      // serverSelectionTimeoutMS: How long Mongoose waits to find a
      // server before throwing an error (default 30s, we use 10s)
      serverSelectionTimeoutMS: 10000,

      // socketTimeoutMS: How long a socket stays open while inactive
      socketTimeoutMS: 45000,
    };

    // ── Step 3: Attempt connection ────────────────────────────────
    // Mask the password in logs for security
    const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
    console.log(`🔄 Connecting to MongoDB: ${maskedUri}`);

    const conn = await mongoose.connect(uri, options);

    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);

    // ── Step 4: Handle runtime disconnections ─────────────────────
    // These events fire AFTER initial connection is established
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB Runtime Error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB Disconnected. Mongoose will try to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB Reconnected Successfully!');
    });

  } catch (err) {
    // ── Connection FAILED ─────────────────────────────────────────
    console.error(`❌ MongoDB Connection Failed: ${err.message}`);
    console.error('');
    console.error('Common causes:');
    console.error('  1. Wrong MONGO_URI in .env');
    console.error('  2. IP not whitelisted in MongoDB Atlas');
    console.error('  3. Network/firewall blocking port 27017');
    console.error('  4. Wrong username or password');
    console.error('');

    // Exit with failure code — process manager will restart
    process.exit(1);
  }
};

module.exports = connectDB;
