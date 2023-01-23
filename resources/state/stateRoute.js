import { Router } from "express";
const router = Router();

import {
  getAllStates,
  getSingleState,
  addState,
  updateState,
  deleteSingleState
} from './stateController.js'

router.route("/state/get-states").get(getAllStates);

router.route("/state/get-single-state/:id").get(getSingleState);

router.route("/state/create-state").post(addState);

router.route("/state/update-state/:id").put(updateState);

router.route("/state/delete-single-state/:id").delete(deleteSingleState);

export default router