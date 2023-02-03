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
  addBookToBookmark,
} from "./userController.js"
import { isAuthenticated } from "../../util/auth.js"
import { vUserRegister, vUserLogin, vUsernameUnique, vBookmark, vAccessToken, vAddUser, vParamId, vUpdateStatus } from "../../util/validators.js"

router.route("/user/register").post(vUserRegister, upload.single('image'), registerUser);

router.route("/user/username-unique").post(vUsernameUnique, userNameExist);

router.route("/user/login").post(vUserLogin, loginUser);

// router.route("/user/get-users").get(getAllUser);

router.route("/user/get-single-user").get(isAuthenticated, getSingleUser);

router.route("/user/get-books-uploadedby-single-user/:id").get(vParamId, getBooksUploadedBySingleUser);

router.route("/user/update-user/:id").put(vParamId, upload.single('image'), updateUser);

router.route("/user/update-user-status").put(vUpdateStatus, updateUserStatus);

router.route("/user/bookmark").post(vBookmark, addBookToBookmark);

export default router;