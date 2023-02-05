import { Router } from "express";
const router = Router();
import { isAuthenticated } from "../../util/auth.js"
import { vAccessToken } from "../../util/validators.js"
import {
  getAllBooksApproved,
  getSingleBookApproved,
  addBook,
  deleteSingleBookApproved,
  updateBookApproved
} from './bookController.js'

import multer from "multer";

const upload = multer({ dest: 'uploads/' })

const cpUpload = upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 }])

router.route("/book/get-books").get(getAllBooksApproved);

router.route("/book/get-single-book/:id").get(getSingleBookApproved);

router.route("/book/create-book").post(vAccessToken, isAuthenticated, cpUpload, addBook);

router.route("/book/update-book").put(vAccessToken, isAuthenticated, updateBookApproved);

router.route("/book/delete-single-book/:id").delete(vAccessToken, isAuthenticated, deleteSingleBookApproved);

export default router