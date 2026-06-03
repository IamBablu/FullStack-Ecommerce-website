import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getAdminOrder, getUserOrder, getVendorOrder, placeOrder, updateOrderStatus, returnOrder, cancelOrder } from "../controllers/order.controller.js";

const routes = Router()

routes.route('/place-order').post(verifyJwt, placeOrder)
routes.route('/get-admin-order').get(verifyJwt, getAdminOrder)
routes.route('/get-user-order').get(verifyJwt, getUserOrder)
routes.route('/get-vendor-order').get(verifyJwt, getVendorOrder)
routes.route('/update-order-status/:orderId').put(verifyJwt, updateOrderStatus)
routes.route('/cancel-order/:orderId').put(verifyJwt, cancelOrder);
routes.route('/return-order/:orderId').put(verifyJwt, returnOrder);

export default routes