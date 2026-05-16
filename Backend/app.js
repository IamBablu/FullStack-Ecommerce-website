import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import routes from './src/routes/user.route.js'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials : true
}))

app.use(express.json())
app.use(express.static('/public'))
app.use(cookieParser())
console.log("aaya")

app.use("/api/v1/users", routes)


export {app}

