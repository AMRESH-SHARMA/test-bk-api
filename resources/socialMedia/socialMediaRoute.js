import { Router } from "express";
const router = Router();

import {
  getSocialMedia,
  updateSocialMedia
} from './socialMediaController.js'

router.route("/socialMedia/get-socialMedia").get(getSocialMedia);

router.route("/socialMedia/update-socialMedia").put(updateSocialMedia);

export default router