import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import UserRoutes from './src/routes/user.route.js'
import AdminRoutes from './src/routes/admin.route.js'
import ProductRoutes from './src/routes/product.route.js'
import OrderRoutes from './src/routes/order.route.js'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials : true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static('/public'))
app.use(cookieParser())


app.use("/api/v1/users", UserRoutes)
app.use("/api/v1/admin", AdminRoutes)
app.use("/api/v1/product", ProductRoutes)
app.use("/api/v1/order", OrderRoutes)



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

