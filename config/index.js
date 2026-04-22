/**
 * Centralized Configuration
 *
 * WHY centralize config?
 *   - Instead of scattering `process.env.XYZ` throughout the codebase,
 *     we read all environment variables in ONE place.
 *   - If a variable name changes, we only update it here.
 *   - Provides default values as fallbacks.
 *   - Makes it easy to see ALL config the app depends on.
 */

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || 'your_default_secret_key_change_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};
