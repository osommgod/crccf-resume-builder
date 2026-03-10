const Config = require('../models/Config');

/**
 * Check if resume submission is still allowed based on deployment timestamp
 */
const getTimeStatus = async (req, res) => {
  try {
    // Get deployment timestamp
    const deploymentConfig = await Config.getValue('DEPLOYMENT_TIMESTAMP');
    
    if (!deploymentConfig) {
      return res.status(500).json({
        success: false,
        error: 'Deployment timestamp not found'
      });
    }

    const deploymentTime = new Date(deploymentConfig);
    const currentTime = new Date();
    const timeLimitMinutes = parseInt(process.env.TIME_LIMIT_MINUTES) || 20;
    
    // Calculate time difference
    const timeDiffMs = currentTime - deploymentTime;
    const timeDiffMinutes = Math.floor(timeDiffMs / (1000 * 60));
    
    const isAllowed = timeDiffMinutes < timeLimitMinutes;
    const remainingMinutes = Math.max(0, timeLimitMinutes - timeDiffMinutes);
    const remainingSeconds = remainingMinutes * 60 - Math.floor((timeDiffMs % (1000 * 60)) / 1000);

    res.json({
      success: true,
      data: {
        isAllowed,
        remainingSeconds,
        remainingMinutes,
        deploymentTime: deploymentTime.toISOString(),
        currentTime: currentTime.toISOString(),
        timeLimitMinutes,
        timeElapsedMinutes: timeDiffMinutes
      },
      message: isAllowed ? 'Resume submission is allowed' : 'Resume submission time has expired'
    });

  } catch (error) {
    console.error('Error checking time status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check time status',
      message: error.message
    });
  }
};

/**
 * Reset deployment timestamp (admin only)
 */
const resetTimeStatus = async (req, res) => {
  try {
    // Simple admin check using environment variable
    const adminKey = req.headers['x-admin-key'] || req.body.adminKey;
    const expectedAdminKey = process.env.ADMIN_KEY || process.env.VITE_ADMIN_PASSWORD;
    
    if (!adminKey || adminKey !== expectedAdminKey) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid admin key'
      });
    }

    // Update deployment timestamp to current time
    const newDeploymentTime = new Date().toISOString();
    await Config.setValue('DEPLOYMENT_TIMESTAMP', newDeploymentTime, 'Deployment timestamp reset by admin');

    res.json({
      success: true,
      data: {
        deploymentTime: newDeploymentTime,
        timeLimitMinutes: parseInt(process.env.TIME_LIMIT_MINUTES) || 20
      },
      message: 'Time status reset successfully'
    });

  } catch (error) {
    console.error('Error resetting time status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset time status',
      message: error.message
    });
  }
};

/**
 * Get time limit configuration
 */
const getTimeConfig = (req, res) => {
  try {
    const timeLimitMinutes = parseInt(process.env.TIME_LIMIT_MINUTES) || 20;
    const checkIntervalSeconds = 30; // Frontend check interval
    
    res.json({
      success: true,
      data: {
        timeLimitMinutes,
        checkIntervalSeconds,
        timeLimitSeconds: timeLimitMinutes * 60,
        features: {
          autoDisable: true,
          countdown: true,
          adminReset: true
        }
      },
      message: 'Time configuration retrieved successfully'
    });

  } catch (error) {
    console.error('Error getting time config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get time configuration',
      message: error.message
    });
  }
};

/**
 * Health check for time status service
 */
const getTimeHealth = async (req, res) => {
  try {
    // Check database connection
    const deploymentConfig = await Config.getValue('DEPLOYMENT_TIMESTAMP');
    const dbConnected = !!deploymentConfig;
    
    // Check environment variables
    const hasTimeLimit = !!process.env.TIME_LIMIT_MINUTES;
    
    const health = {
      status: 'healthy',
      checks: {
        database: dbConnected ? 'connected' : 'disconnected',
        environment: hasTimeLimit ? 'configured' : 'missing_config',
        service: 'operational'
      },
      timestamp: new Date().toISOString()
    };

    // If any check fails, mark as degraded
    if (!dbConnected || !hasTimeLimit) {
      health.status = 'degraded';
    }

    const statusCode = health.status === 'healthy' ? 200 : 503;

    res.status(statusCode).json({
      success: health.status === 'healthy',
      data: health,
      message: `Time status service is ${health.status}`
    });

  } catch (error) {
    console.error('Time status health check failed:', error);
    res.status(503).json({
      success: false,
      data: {
        status: 'unhealthy',
        checks: {
          database: 'error',
          environment: 'error',
          service: 'error'
        },
        timestamp: new Date().toISOString(),
        error: error.message
      },
      error: 'Time status service is unhealthy'
    });
  }
};

module.exports = {
  getTimeStatus,
  resetTimeStatus,
  getTimeConfig,
  getTimeHealth
};
