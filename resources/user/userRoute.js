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
  updateUser,
  getSingleUser,
  getBooksUploadedBySingleUser,
  getAllUser,
  addUser,
} from "./userController.js"
import { isAuthenticated } from "../../util/auth.js"
import { vAccessToken, vAddUser, vParamId, vUpdateStatus } from "../../util/validators.js"

router.route("/user/get-users").get(vAccessToken, isAuthenticated, getAllUser);

router.route("/user/create-user").post(vAccessToken, isAuthenticated, vAddUser, addUser);

router.route("/user/get-single-user/:id").get(vAccessToken, isAuthenticated, vParamId, getSingleUser);

router.route("/user/get-books-uploadedby-single-user/:id").get(vAccessToken, isAuthenticated, vParamId, getBooksUploadedBySingleUser);

router.route("/user/update-user/:id").put(vAccessToken, isAuthenticated, vParamId, upload.single('image'), updateUser);

router.route("/user/update-user-status").put(vAccessToken, isAuthenticated, vUpdateStatus, updateUserStatus);

// router.route("/user/forgot-password").post(forgotPassword);

// router.route("/user/password/reset/:token").put(resetPassword);

// router.route("/user/details").get(isAuthenticatedUser, getUserDetails);
// router
//     .route("/admin/users")
//     .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);
// router
//     .route("/admin/user/:id")
//     .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)



// router.route("/user/password/update").put(isAuthenticatedUser, updatePassword);

// router.route("/user/update-profile").put(vAccessToken, isAuthenticatedUser, updateProfile);

export default router;