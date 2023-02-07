import { Router } from "express";
const router = Router();

import {
  getAllAddressByUserId,
  addUserAddress,
  getSingleUserAddressByParam,
  // updateUserStatus,
  // updateUserByParam,

  // getBooksUploadedBySingleUserByParam,
} from "./userAddressController.js"
import { isAuthenticatedAdmin } from "../../util/auth.js"
import { vAccessToken, vAddUserAddressClient, vParamId, vUpdateStatus } from "../../util/validators.js"

router.route("/user/create-address").post(vAccessToken, isAuthenticatedAdmin, vAddUserAddressClient, addUserAddress);

router.route("/user/get-address/:userId").get(vAccessToken, isAuthenticatedAdmin, getAllAddressByUserId);

router.route("/user/get-single-address/:id").get(vAccessToken, isAuthenticatedAdmin, getSingleUserAddressByParam);

// router.route("/user/get-books-uploadedby-single-user/:id").get(vAccessToken, isAuthenticatedAdmin, vParamId, getBooksUploadedBySingleUserByParam);

// router.route("/user/update-user/:id").put( upload.single('image'), updateUserByParam);

// router.route("/user/update-user-status").put(vAccessToken, isAuthenticatedAdmin, vUpdateStatus, updateUserStatus);

export default router;