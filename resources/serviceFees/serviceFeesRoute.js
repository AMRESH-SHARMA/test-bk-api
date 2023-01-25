import { Router } from "express";
const router = Router();

import {
  getAllServiceFees,
  getSingleServiceFees,
  addServiceFees,
  updateServiceFees,
  deleteSingleServiceFees
} from './serviceFeesController.js'

router.route("/serviceFees/get-serviceFees").get(getAllServiceFees);

router.route("/serviceFees/get-single-serviceFees/:id").get(getSingleServiceFees);

router.route("/serviceFees/create-serviceFees").post(addServiceFees);

router.route("/serviceFees/update-serviceFees/:id").put(updateServiceFees);

router.route("/serviceFees/delete-single-serviceFees/:id").delete(deleteSingleServiceFees);

export default router