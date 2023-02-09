import { Router } from "express";
const router = Router();

import {
  getAllLogos,
  updateLogos,
} from './logosController.js'

import multer from "multer";
const upload = multer({ dest: 'uploads/' })
const cpUpload = upload.fields([
  { name: 'websiteHeader', maxCount: 1 },
  { name: 'websiteFooter', maxCount: 1 },
  { name: 'websiteAdminHeader', maxCount: 1 }])

router.route("/logos/get-logos").get(getAllLogos);

router.route("/logos/update-logos").put(cpUpload,updateLogos);

export default router