import { Router } from "express";
import {logOut, loginUser, createUser, generateAccessAndRefreshToken} from '../controllers/user.controller.js'
import { verifyJwt } from "../middlewares/auth.middleware.js";
const routes = Router()
console.log("routes")

routes.route('/signup').post(createUser)

routes.route('/signin').post(loginUser)

routes.route('/signout').get(verifyJwt, logOut)

export default routes