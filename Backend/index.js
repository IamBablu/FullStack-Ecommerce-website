
import dotenv from 'dotenv'
dotenv.config()
import DBconnect from './src/db/index.js'
import { app } from './app.js'
const port = process.env.PORT || 8000


DBconnect()
.then(()=>{
    app.on("error", (err)=>{
        console.log("An error has occurred: ", err)
        throw err
    })
    app.listen(port || 9000, ()=>{
        console.log("DB connect successfully at port: ", port)
    })
})
.catch((err)=>{
    console.log("DB connection failed: ", err)
})