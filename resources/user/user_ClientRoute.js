import { Router } from "express";
const router = Router();
import multer from "multer";
const upload = multer({ dest: 'uploads/' })

import {
  registerUser,
  loginUser,
  userNameExist,
  // logout,
  forgotPassword,
  changePasswordOtpVerify,
  updatePassword,
  updateUser,
  getSingleUser,
  getBooksUploadedBySingleUser,
  toggleBookmark,
  allBookmark,
  pushToCart,
  popFromCart,
  emptyCart,
  getCart,
  updateItemDurationInCart
} from "./userController.js"
import { isAuthenticated } from "../../util/auth.js"
import { vUserLogin, vUsernameUnique, vBookmark, vAccessToken } from "../../util/validators.js"

router.route("/user/register").post(upload.single('image'), registerUser);

router.route("/user/login").post(vUserLogin, loginUser);

router.route("/user/forgotPassword").post(forgotPassword);

router.route("/user/forgotPassword/OtpVerify").post(changePasswordOtpVerify);

router.route("/user/updatePassword").post(updatePassword);

router.route("/user/username-unique").post(vAccessToken, isAuthenticated, vUsernameUnique, userNameExist);

router.route("/user/get-single-user").get(vAccessToken, isAuthenticated, getSingleUser);

router.route("/user/get-books-uploadedby-single-user").get(vAccessToken, isAuthenticated, getBooksUploadedBySingleUser);

router.route("/user/update-user").put(vAccessToken, isAuthenticated, upload.single('image'), updateUser);

// book mark
router.route("/user/bookmark").post(vAccessToken, isAuthenticated, vBookmark, toggleBookmark);

router.route("/user/all-bookmark").get(vAccessToken, isAuthenticated, allBookmark);

// cart
router.route("/user/cart/:bookId").post(vAccessToken, isAuthenticated, pushToCart);

router.route("/user/cart/item/:bookId").put(vAccessToken, isAuthenticated, updateItemDurationInCart);

router.route("/user/cart").post(vAccessToken, isAuthenticated, popFromCart);

router.route("/user/cart").delete(vAccessToken, isAuthenticated, emptyCart);

router.route("/user/cart").get(vAccessToken, isAuthenticated, getCart);

export default router;