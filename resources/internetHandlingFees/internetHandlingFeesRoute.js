import { Router } from "express";
const router = Router();

import {
  getInternetHandlingFees,
  updateInternetHandlingFees
} from './internetHandlingFeesController.js'

router.route("/internetHandlingFees/get-internetHandlingFees").get(getInternetHandlingFees);

router.route("/internetHandlingFees/update-internetHandlingFees").put(updateInternetHandlingFees);

export default router