import { Router } from "express";
const router = Router();

import {
  getAllCities,
  getSingleCity,
  addCity,
  updateCity,
  deleteSingleCity
} from './cityController.js'

router.route("/city/get-cities").get(getAllCities);

router.route("/city/get-single-city/:id").get(getSingleCity);

router.route("/city/create-city").post(addCity);

router.route("/city/update-city/:id").put(updateCity);

router.route("/city/delete-single-city/:id").delete(deleteSingleCity);

export default router