import { Router } from "express";
const router = Router();

import {
  getAllOrders,
  getOrderById,
  addOrder,
} from './orderController.js'
import { isAuthenticated } from "../../util/auth.js"
import { vAccessToken } from "../../util/validators.js"

router.route("/order").get(getAllOrders);

router.route("/order/:id").get(getOrderById);

router.route("/order").post(vAccessToken, isAuthenticated, addOrder);

// router.route("/genre/update-genre/:id").put(updategenre);

// router.route("/genre/delete-single-genre/:id").delete(deleteSinglegenre);

export default router