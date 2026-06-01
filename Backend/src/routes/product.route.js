import { Router } from "express";

import { createProduct, getMyProduct, getUserProduct, editProduct, activeProduct, getCartProduct} from "../controllers/product.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const routes = Router()

routes.route('/create-product').post(verifyJwt, upload.array('images', 4), createProduct);
routes.route('/edit-product').patch(verifyJwt, upload.array('images', 4), editProduct);
routes.route('/active-product').patch(verifyJwt, activeProduct);
routes.route('/get-my-product').get(verifyJwt, getMyProduct);
routes.route('/get-user-product').get(getUserProduct);
routes.route("/get-cart-product").get(verifyJwt,getCartProduct);

export default routes