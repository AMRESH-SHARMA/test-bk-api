import { Router } from "express";
const router = Router();
import multer from "multer";
const upload = multer({ dest: 'uploads/' })

import {
  updateDeliveryCarrier,
  deleteDeliveryCarrier,
  getAllCarrier,
  getSingleCarrier,
  createDeliveryCarrier,
  updateStatus
} from "./deliveryCarrierController.js"
import { isAuthenticatedAdmin } from "../../util/auth.js"
import { vAccessToken } from "../../util/validators.js"

router.route("/deliveryCarrier").get(vAccessToken, isAuthenticatedAdmin, getAllCarrier);

router.route("/deliveryCarrier").post(vAccessToken, isAuthenticatedAdmin, upload.single('image'), createDeliveryCarrier);

router.route("/deliveryCarrier/:carrierId").get(vAccessToken, isAuthenticatedAdmin, getSingleCarrier);

router.route("/deliveryCarrier").put(vAccessToken, isAuthenticatedAdmin, updateStatus);

router.route("/deliveryCarrier/:carrierId").put(upload.single('image'), updateDeliveryCarrier);

router.route("/deliveryCarrier/:carrierId").delete(vAccessToken, isAuthenticatedAdmin, deleteDeliveryCarrier);

export default router;