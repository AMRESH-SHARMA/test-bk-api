import { Router } from "express";
const router = Router();

import {
  getAllAddressByParam,
  addUserAddress,
  getSingleUserAddressByParam,
  updateUserAddress,
  deleteSingleAddress
} from "./userAddressController.js"
import { isAuthenticatedAdmin } from "../../util/auth.js"
import { vAccessToken, vAddUserAddress } from "../../util/validators.js"

router.route("/user/create-address").post(vAccessToken, isAuthenticatedAdmin, vAddUserAddress, addUserAddress);

router.route("/user/get-address/:userId").get(vAccessToken, isAuthenticatedAdmin, getAllAddressByParam);

router.route("/user/get-single-address/:addressId").get(vAccessToken, isAuthenticatedAdmin, getSingleUserAddressByParam);

router.route("/user/update-address/:addressId").put(vAccessToken, isAuthenticatedAdmin, updateUserAddress);

router.route("/user/delete-single-address/:addressId/:userId").delete(vAccessToken, isAuthenticatedAdmin, deleteSingleAddress);

export default router;