import { Router } from "express";
const router = Router();
import multer from "multer";
const upload = multer({ dest: 'uploads/' })

import {
  registerUser,
  loginUser,
  userNameExist,
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
import { vUserRegister, vUserLogin, vUsernameUnique, vAccessToken, vAddUser, vParamId, vUpdateStatus } from "../../util/validators.js"

router.route("/user/register").post(vUserRegister, upload.single('image'), registerUser);

router.route("/user/username-unique").post(vUsernameUnique, userNameExist);

router.route("/user/login").post(vUserLogin, loginUser);

router.route("/user/get-users").get(getAllUser);

router.route("/user/create-user").post(vAddUser, addUser);

router.route("/user/get-single-user/:id").get(vParamId, getSingleUser);

router.route("/user/get-books-uploadedby-single-user/:id").get(vParamId,isAuthenticated, getBooksUploadedBySingleUser);

router.route("/user/update-user/:id").put(vParamId, upload.single('image'), updateUser);

router.route("/user/update-user-status").put(vUpdateStatus, updateUserStatus);

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