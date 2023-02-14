import { Router } from "express";
const router = Router();

import {
  getAllOrders,
  getOrderById,
} from './orderController.js'
import { isAuthenticated } from "../../util/auth.js"
import { vAccessToken } from "../../util/validators.js"

router.route("/order").get(vAccessToken, isAuthenticated, getAllOrders);

router.route("/order/:id").get(vAccessToken, isAuthenticated, getOrderById);

// router.route("/genre/update-genre/:id").put(updategenre);

// router.route("/genre/delete-single-genre/:id").delete(deleteSinglegenre);

export default router