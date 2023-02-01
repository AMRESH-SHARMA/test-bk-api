import { Router } from "express";
const router = Router();

import {
  getAllgenres,
  getSinglegenre,
  addgenre,
  updategenre,
  deleteSinglegenre
} from './genreController.js'

import multer from "multer";

const upload = multer({ dest: 'uploads/' })

router.route("/genre/get-genres").get(getAllgenres);

router.route("/genre/get-single-genre/:id").get(getSinglegenre);

router.route("/genre/create-genre").post(upload.single('image'), addgenre);

router.route("/genre/update-genre/:id").put(updategenre);

router.route("/genre/delete-single-genre/:id").delete(deleteSinglegenre);

export default router