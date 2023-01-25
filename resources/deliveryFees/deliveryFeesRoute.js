import { Router } from "express";
const router = Router();

import {
  getAllDeliveryFees,
  getSingleDeliveryFees,
  addDeliveryFees,
  updateDeliveryFees,
  deleteSingleDeliveryFees
} from './deliveryFeesController.js'

router.route("/deliveryFees/get-deliveryFees").get(getAllDeliveryFees);

router.route("/deliveryFees/get-single-deliveryFees/:id").get(getSingleDeliveryFees);

router.route("/deliveryFees/create-deliveryFees").post(addDeliveryFees);

router.route("/deliveryFees/update-deliveryFees/:id").put(updateDeliveryFees);

router.route("/deliveryFees/delete-single-deliveryFees/:id").delete(deleteSingleDeliveryFees);

export default router