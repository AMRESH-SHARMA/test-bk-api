import { Router } from "express";
const router = Router();

import { getCopyright, updateCopyright } from "./copyrightController.js";

router.get("/", getCopyright);
router.patch("/", updateCopyright);

export default router;
