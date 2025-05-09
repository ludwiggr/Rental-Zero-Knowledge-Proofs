const jwt = require('jsonwebtoken');
const { RateLimiterMongo } = require('rate-limiter-flexible');
const mongoose = require('mongoose');

const rateLimiter = new RateLimiterMongo({
    storeClient: mongoose.connection,
    points: 10, // Number of points
    duration: 1, // Per second
});

const auth = async (req, res, next) => {
    try {
        // Rate limiting
        await rateLimiter.consume(req.ip);

        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'RateLimiterError') {
            res.status(429).json({ error: 'Too many requests' });
        } else {
            res.status(401).json({ error: 'Please authenticate' });
        }
    }
};

module.exports = auth; 