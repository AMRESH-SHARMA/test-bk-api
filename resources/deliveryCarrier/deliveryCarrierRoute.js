import { Router } from "express";
const router = Router();
import multer from "multer";
const upload = multer({ dest: 'uploads/' })

import {
  // logout,
  // forgotPassword,
  // resetPassword,
  // updatePassword,
  // updateProfile,
  // updateUserByParam,
  // getBooksUploadedBySingleUserByParam,
  getAllCarrier,
  getSingleCarrier,
  createDeliveryCarrier,
  updateStatus
} from "./deliveryCarrierController.js"
import { isAuthenticatedAdmin } from "../../util/auth.js"
import { vAccessToken } from "../../util/validators.js"

router.route("/deliveryCarrier").get(vAccessToken, isAuthenticatedAdmin, getAllCarrier);

router.route("/deliveryCarrier").post(vAccessToken, isAuthenticatedAdmin, createDeliveryCarrier);

router.route("/deliveryCarrier/:carrierId").get(vAccessToken, isAuthenticatedAdmin, getSingleCarrier);

router.route("/deliveryCarrier").put(vAccessToken, isAuthenticatedAdmin, updateStatus);
// ******************

// router.route("/user/get-books-uploadedby-single-user/:id").get(vAccessToken, isAuthenticatedAdmin, getBooksUploadedBySingleUserByParam);

// router.route("/user/update-user/:id").put(upload.single('image'), updateUserByParam);

// router.route("/user/forgot-password").post(forgotPassword);

// router.route("/user/password/reset/:token").put(resetPassword);

// router.route("/user/details").get(isAuthenticatedAdminUser, getUserDetails);
// router
//     .route("/admin/users")
//     .get(isAuthenticatedAdminUser, authorizeRoles("admin"), getAllUser);
// router
//     .route("/admin/user/:id")
//     .get(isAuthenticatedAdminUser, authorizeRoles("admin"), getSingleUser)



// router.route("/user/password/update").put(isAuthenticatedAdminUser, updatePassword);

// router.route("/user/update-profile").put(vAccessToken, isAuthenticatedAdminUser, updateProfile);

export default router;