import rateLimit,  { ipKeyGenerator } from 'express-rate-limit'
const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3,
    keyGenerator: (req) => {
        const email =  req.body.email?.toLowerCase().trim() || req.ip;
        return email || ipKeyGenerator(req.ip)
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