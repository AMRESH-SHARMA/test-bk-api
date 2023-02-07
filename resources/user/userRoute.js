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
  updateUserStatus,
  updateUserByParam,
  getSingleUserByParam,
  getBooksUploadedBySingleUserByParam,
  getAllUser,
  addUser,
} from "./userController.js"
import { isAuthenticatedAdmin } from "../../util/auth.js"
import { vAccessToken, vAddUser, vParamId, vUpdateStatus } from "../../util/validators.js"

router.route("/user/get-users").get(vAccessToken, isAuthenticatedAdmin, getAllUser);

router.route("/user/create-user").post(vAccessToken, isAuthenticatedAdmin, vAddUser, addUser);

router.route("/user/get-single-user/:id").get(vAccessToken, isAuthenticatedAdmin, vParamId, getSingleUserByParam);

router.route("/user/get-books-uploadedby-single-user/:id").get(vAccessToken, isAuthenticatedAdmin, vParamId, getBooksUploadedBySingleUserByParam);

router.route("/user/update-user/:id").put( upload.single('image'), updateUserByParam);

router.route("/user/update-user-status").put(vAccessToken, isAuthenticatedAdmin, vUpdateStatus, updateUserStatus);

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