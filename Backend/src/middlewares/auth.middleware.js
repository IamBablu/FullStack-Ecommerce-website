import {AsyncHandler} from '../utils/AsyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import jwt from 'jsonwebtoken'
import {User} from '../models/user.model.js'

const verifyJwt = AsyncHandler (async(req, _ , next) => {
    try {
        console.log("this is middleware auth")
        const token = req.cookies?.accessToken || header('Authorization')?.replace('Bearer', '')
        if(!token) throw new ApiError(400, 'token not found')
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRETE)
        const user = await User.findById(decodedToken?._id).select('-password -refreshToken')
        if(!decodedToken) throw new ApiError(401, 'Invalid Access Token')
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(500, error.message || 'Invalid Access Token')
    }
})


export {verifyJwt}
