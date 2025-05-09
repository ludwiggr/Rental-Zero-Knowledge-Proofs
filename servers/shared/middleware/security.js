const jwt = require('jsonwebtoken');
const { RateLimiterMongo } = require('rate-limiter-flexible');
const mongoose = require('mongoose');
const winston = require('winston');
const bcrypt = require('bcrypt');

// Configure rate limiter
const rateLimiter = new RateLimiterMongo({
    storeClient: mongoose.connection,
    points: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
    duration: process.env.RATE_LIMIT_WINDOW_MS ? process.env.RATE_LIMIT_WINDOW_MS / 1000 : 900,
    blockDuration: 60 * 15, // Block for 15 minutes if limit is exceeded
});

// Configure logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ 
            filename: process.env.LOG_FILE_PATH || 'logs/error.log', 
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        new winston.transports.File({ 
            filename: process.env.LOG_FILE_PATH || 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

// Authentication middleware
const authenticate = async (req, res, next) => {
    try {
        // Rate limiting
        await rateLimiter.consume(req.ip);

        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error('No token provided');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        
        // Log successful authentication
        logger.info('User authenticated', {
            userId: decoded.id,
            ip: req.ip,
            path: req.path
        });
        
        next();
    } catch (error) {
        if (error.name === 'RateLimiterError') {
            logger.warn('Rate limit exceeded', { ip: req.ip });
            res.status(429).json({ error: 'Too many requests' });
        } else if (error.name === 'JsonWebTokenError') {
            logger.warn('Invalid token', { ip: req.ip });
            res.status(401).json({ error: 'Invalid token' });
        } else if (error.name === 'TokenExpiredError') {
            logger.warn('Token expired', { ip: req.ip });
            res.status(401).json({ error: 'Token expired' });
        } else {
            logger.error('Authentication error', { error: error.message, ip: req.ip });
            res.status(401).json({ error: 'Please authenticate' });
        }
    }
};

// Password hashing
const hashPassword = async (password) => {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    return bcrypt.hash(password, saltRounds);
};

// Password verification
const verifyPassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
};

// Generate tokens
const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION || '1h' }
    );
    
    const refreshToken = jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' }
    );
    
    return { accessToken, refreshToken };
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    logger.error('Error occurred', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip
    });

    res.status(err.status || 500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

module.exports = {
    authenticate,
    hashPassword,
    verifyPassword,
    generateTokens,
    errorHandler,
    logger
}; 