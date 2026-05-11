import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    secrete_key : process.env.CLOUDINARY_API_SECRETE
})


const uploadCloudinary = async (localPath) => {
    try {
        if (!localPath) return null
        const response = await cloudinary.uploader.upload(localPath,{
            resource_type = 'auto'
        })
        fs.unlinkSync(localPath)
        return response
    } catch (error) {
        fs.unlinkSync(localPath)
        return null
    }
}

export {uploadCloudinary}