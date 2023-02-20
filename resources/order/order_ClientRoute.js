import { Router } from "express";
const router = Router();

import {
  getOrdersByUserId,
  getOrderById,
  addOrder,
  generateOrderBill,
  orderSingleItem,
  generateSingleOrderBill,
} from './orderController.js'
import { isAuthenticated } from "../../util/auth.js"
import { vAccessToken } from "../../util/validators.js"

router.route("/order").get(vAccessToken, isAuthenticated, getOrdersByUserId);

router.route("/order/:id").get(vAccessToken, isAuthenticated, getOrderById);

router.route("/order").post(vAccessToken, isAuthenticated, addOrder);

router.route("/order/bill").post(vAccessToken, isAuthenticated, generateOrderBill);

router.route("/order/single").post(vAccessToken, isAuthenticated, orderSingleItem);

router.route("/order/single/bill").post(vAccessToken, isAuthenticated, generateSingleOrderBill);

// router.route("/genre/update-genre/:id").put(updategenre);

// router.route("/genre/delete-single-genre/:id").delete(deleteSinglegenre);

export default router