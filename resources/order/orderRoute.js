import { Router } from "express";
const router = Router();

import {
  getOrders,
  getOrderById,
  updateOrderStatus
} from './orderController.js'
import { isAuthenticatedAdmin } from "../../util/auth.js"
import { vAccessToken } from "../../util/validators.js"

router.route("/order").get(vAccessToken, isAuthenticatedAdmin, getOrders);

router.route("/order/:orderId").get(vAccessToken, isAuthenticatedAdmin, getOrderById);

router.route("/order/:orderId").put(updateOrderStatus);

// router.route("/genre/delete-single-genre/:id").delete(deleteSinglegenre);

export default router