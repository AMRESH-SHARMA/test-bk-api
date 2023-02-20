import { Router } from "express";
const router = Router();

import {
  getOrdersByUserId,
  getOrderById,
  addOrder,
  addSingleOrder,
  generateOrderBill
} from './orderController.js'
import { isAuthenticated } from "../../util/auth.js"
import { vAccessToken } from "../../util/validators.js"

router.route("/order").get(vAccessToken, isAuthenticated, getOrdersByUserId);

router.route("/order/:id").get(vAccessToken, isAuthenticated, getOrderById);

router.route("/order").post(vAccessToken, isAuthenticated, addOrder);

router.route("/order/single").post(vAccessToken, isAuthenticated, addSingleOrder);

router.route("/order/bill").post(vAccessToken, isAuthenticated, generateOrderBill);

// router.route("/genre/update-genre/:id").put(updategenre);

// router.route("/genre/delete-single-genre/:id").delete(deleteSinglegenre);

export default router