import { Router } from "express";
const router = Router();

import {
  addUserAddressClient,
} from "./userAddressController.js"
import { isAuthenticated } from "../../util/auth.js"
import { vAddUserAddressClient, vAccessToken } from "../../util/validators.js"

router.route("/user/create-address").post(vAccessToken, isAuthenticated, vAddUserAddressClient, addUserAddressClient);

export default router;