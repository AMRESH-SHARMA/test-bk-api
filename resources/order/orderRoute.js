import { Router } from "express";
const router = Router();

import {
  getAllOrders,
  getOrderById,
  addOrder,
} from './orderController.js'

router.route("/order").get(getAllOrders);

router.route("/order/:id").get(getOrderById);

router.route("/order").post(addOrder);

// router.route("/genre/update-genre/:id").put(updategenre);

// router.route("/genre/delete-single-genre/:id").delete(deleteSinglegenre);

export default router