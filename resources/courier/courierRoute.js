import { Router } from "express";
const router = Router();
import multer from "multer";
const upload = multer({ dest: 'uploads/' })

import {
  updateCourier,
  deleteCourier,
  getAllCourier,
  getSingleCourier,
  createCourier,
  updateStatus,
  getAllApprovedCourier
} from "./courierController.js"
import { isAuthenticatedAdmin } from "../../util/auth.js"
import { vAccessToken } from "../../util/validators.js"

router.route("/courier").get(vAccessToken, isAuthenticatedAdmin, getAllCourier);

router.route("/courier/approved").get(vAccessToken, isAuthenticatedAdmin, getAllApprovedCourier);

router.route("/courier").post(vAccessToken, isAuthenticatedAdmin, upload.single('image'), createCourier);

router.route("/courier/:courierId").get(vAccessToken, isAuthenticatedAdmin, getSingleCourier);

router.route("/courier").put(vAccessToken, isAuthenticatedAdmin, updateStatus);

router.route("/courier/:courierId").put(upload.single('image'), updateCourier);

router.route("/courier/:courierId").delete(vAccessToken, isAuthenticatedAdmin, deleteCourier);

export default router;