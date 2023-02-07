import { Router } from "express";
const router = Router();

import {
  addUserAddressClient,
  getAllAddressClient,
  deleteSingleAddressClient,
} from "./userAddressController.js"
import { isAuthenticated } from "../../util/auth.js"
import { vAccessToken } from "../../util/validators.js"

router.route("/user/create-address").post(vAccessToken, isAuthenticated, addUserAddressClient);

router.route("/user/get-address").get(vAccessToken, isAuthenticated, getAllAddressClient);

router.route("/user/delete-single-address/:addressId").delete(deleteSingleAddressClient);

export default router;