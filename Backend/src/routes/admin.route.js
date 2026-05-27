import { Router } from "express";
import { verifyVendor,verifyProduct , getVendors, getAllProduct } from "../controllers/admin.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";

const routes1 = Router()

routes1.route('/verify-vendor').patch(verifyJwt, verifyVendor);
routes1.route('/verify-product').patch(verifyJwt, verifyProduct);
routes1.route('/get-vendors').get(verifyJwt, getVendors);
routes1.route('/get-products').get(verifyJwt, getAllProduct)


export default routes1