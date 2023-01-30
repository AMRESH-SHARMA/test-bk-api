import { Router } from "express";
const router = Router();

import {
  register,
  login,
  updatePassword,
  // logout,
  // forgotPassword,
  // resetPassword,
  // updatePassword,
  // updateProfile,
  // updateUserStatus,
  updateAdmin,
  getSingleAdmin,
  // getAllUser,
  // createUser,
} from "./adminController.js"
import { isAuthenticated } from "../../util/auth.js"
import { vAccessToken, vAdminLogin } from "../../util/validators.js"
import multer from "multer";
const upload = multer({ dest: 'uploads/' })

router.route("/admin/register").post(register);

router.route("/admin/login").post(vAdminLogin, login);

router.route("/admin/change-password").post(isAuthenticated, updatePassword);

router.route("/admin/get-single-admin/:id").get(getSingleAdmin);

router.route("/admin/update-admin/:id").put(upload.single('image'), updateAdmin);

// router.route("/user/forgot-password").post(forgotPassword);

// router.route("/user/password/reset/:token").put(resetPassword);

// router.route("/user/logout").delete(logout);

// router.route("/user/details").get(isAuthenticatedUser, getUserDetails);
// router
//     .route("/admin/users")
//     .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);
// router
//     .route("/admin/user/:id")
//     .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)



// router.route("/user/password/update").put(isAuthenticatedUser, updatePassword);

// router.route("/user/update-profile").put(vAccessToken, isAuthenticatedUser, updateProfile);

//

// router.route("/user/get-users").get(getAllUser);

// router.route("/user/create-user").post(createUser);

// router.route("/user/update-user-status").put(updateUserStatus);

export default router;