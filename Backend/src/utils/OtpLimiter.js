import rateLimit from 'express-rate-limit'
const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3,
    keyGenerator: (req) => {
        return req.body.email?.toLowerCase() || req.ip;
    },
    handler: (req, res) =>{ 
        return res.status(429).json({
            status: 429,
            message: "Too many Otp requests"
        })
    },
    standardHeaders: true,
    legacyHeaders: false,
})

export default otpLimiter