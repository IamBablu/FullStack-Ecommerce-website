import { Router } from "express";
import { verifyVendor,verifyProduct , getVendors, getAllProduct } from "../controllers/admin.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";

const routes = Router()

routes.route('/verify-vendor').patch(verifyJwt, verifyVendor);
routes.route('/verify-product').patch(verifyJwt, verifyProduct);
routes.route('/get-vendors').get(verifyJwt, getVendors);
routes.route('/get-products').get(verifyJwt, getAllProduct)


export default routes