import { Router } from "express";
const router = Router();

import {
  getAllAddressByParam,
  addUserAddress,
  getSingleUserAddressByParam,
  deleteSingleAddress
} from "./userAddressController.js"
import { isAuthenticatedAdmin } from "../../util/auth.js"
import { vAccessToken, vAddUserAddressClient } from "../../util/validators.js"

router.route("/user/create-address").post(vAccessToken, isAuthenticatedAdmin, vAddUserAddressClient, addUserAddress);

router.route("/user/get-address/:userId").get(vAccessToken, isAuthenticatedAdmin, getAllAddressByParam);

router.route("/user/get-single-address/:addressId").get(vAccessToken, isAuthenticatedAdmin, getSingleUserAddressByParam);

router.route("/user/delete-single-address/:addressId/:userId").delete(deleteSingleAddress);

export default router;