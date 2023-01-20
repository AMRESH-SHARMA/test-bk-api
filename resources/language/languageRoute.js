import { Router } from "express";
const router = Router();

import {
  getAlllanguages,
  getSinglelanguage,
  addlanguage,
  updatelanguage,
  deleteSinglelanguage
} from './languageController.js'

router.route("/language/get-languages").get(getAlllanguages);

router.route("/language/get-single-language/:id").get(getSinglelanguage);

router.route("/language/create-language").post(addlanguage);

router.route("/language/update-language/:id").put(updatelanguage);

router.route("/language/delete-single-language/:id").delete(deleteSinglelanguage);

export default router