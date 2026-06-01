import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import routes from './src/routes/user.route.js'
import routes1 from './src/routes/admin.route.js'
import routsP from './src/routes/product.route.js'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials : true
}))

app.use(express.json())
app.use(express.static('/public'))
app.use(cookieParser())


app.use("/api/v1/users", routes)
app.use("/api/v1/admin", routes1)
app.use("/api/v1/product", routsP)


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Console mein Error control
    console.error(`❌ Error: ${message}`); 

    // Frontend ko ek structured JSON response milega
    return res.status(statusCode).json({
        statusCode: statusCode,
        success: false,
        message: message,
        errors: err.errors || []
    });
});


export {app}

