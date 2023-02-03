import { Router } from "express";
const router = Router();

import {
  getAllBooks,
  getSingleBook,
  addBook,
  updateBook,
  updateBookStatus,
  deleteSingleBook
} from './bookController.js'

import multer from "multer";

const upload = multer({ dest: 'uploads/' })

const cpUpload = upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 }])

router.route("/book/get-books").get(getAllBooks);

// router.route("/book/get-books-byproperty").get(getAllBooksByProperty);

router.route("/book/get-single-book/:id").get(getSingleBook);

router.route("/book/create-book").post(cpUpload, addBook);

router.route("/book/update-book/:id").put(updateBook);

router.route("/book/update-book-status").put(updateBookStatus);

router.route("/book/delete-single-book/:id/:uploadedBy").delete(deleteSingleBook);

export default router