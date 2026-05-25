import { Router } from "express";

import { createProduct, getMyProduct, getUserProduct} from "../controllers/product.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const routsP = Router()

routsP.route('/create-product').post(verifyJwt, upload.array('images', 4), createProduct);
routsP.route('/get-my-product').get(verifyJwt, getMyProduct);
routsP.route('/get-user-product').get(getUserProduct);

export default routsP