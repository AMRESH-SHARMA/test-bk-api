import { Router } from "express";
const router = Router();

import {
  getAddress,
  updateAddress
} from './addressController.js'

router.route("/address/get-address").get(getAddress);

router.route("/address/update-address/:id").put(updateAddress);

export default router