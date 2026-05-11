import mongoose from "mongoose";

const DBconnect = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`)
        console.log("DB connection successful: ", connectionInstance.connection.host)
    } catch (error) {
        console.log("DB connection error: ", error)
        process.exit(1)
    }
}

export default DBconnect