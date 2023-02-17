import { Router } from "express";
const router = Router();

import {
  getNewOrders,
  getOrderById,
} from './orderController.js'
import { isAuthenticatedAdmin } from "../../util/auth.js"
import { vAccessToken } from "../../util/validators.js"

router.route("/order").get(vAccessToken, isAuthenticatedAdmin, getNewOrders);

router.route("/order/:id").get(vAccessToken, isAuthenticatedAdmin, getOrderById);

// router.route("/genre/update-genre/:id").put(updategenre);

// router.route("/genre/delete-single-genre/:id").delete(deleteSinglegenre);

export default router