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


export {app}

