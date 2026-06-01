import rateLimit,  { ipKeyGenerator } from 'express-rate-limit'
const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3,
    keyGenerator: (req) => {
        const email =  req.body.email?.toLowerCase().trim() || req.ip;
        // return email || ipKeyGenerator(req.ip)
        return email || req.ip || req.headers['x-forwarded-for'];
    },
    handler: (req, res) =>{ 
        return res.status(429).json({
            status: 429,
            success: false,
            message: "Too many Otp requests, please try after 10 minutes",
            errors: []
        })
    },
    standardHeaders: true,
    legacyHeaders: false,
})

export default otpLimiter