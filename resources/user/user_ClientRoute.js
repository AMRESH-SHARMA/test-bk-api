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
  updateUser,
  getSingleUser,
  getBooksUploadedBySingleUser,
  toggleBookmark,
  allBookmark,
} from "./userController.js"
import { isAuthenticated } from "../../util/auth.js"
import { vUserLogin, vUsernameUnique, vBookmark, vAccessToken } from "../../util/validators.js"

router.route("/user/register").post(upload.single('image'), registerUser);

router.route("/user/login").post(vUserLogin, loginUser);

router.route("/user/username-unique").post(vAccessToken, isAuthenticated, vUsernameUnique, userNameExist);

router.route("/user/get-single-user").get(vAccessToken, isAuthenticated, getSingleUser);

router.route("/user/get-books-uploadedby-single-user").get(vAccessToken, isAuthenticated, getBooksUploadedBySingleUser);

router.route("/user/update-user").put(vAccessToken, isAuthenticated, upload.single('image'), updateUser);

router.route("/user/bookmark").post(vAccessToken, isAuthenticated, vBookmark, toggleBookmark);

router.route("/user/all-bookmark").get(vAccessToken, isAuthenticated, allBookmark);

export default router;