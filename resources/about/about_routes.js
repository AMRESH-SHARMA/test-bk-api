import { Router } from "express";
const router = Router();

import { getCopyright, updateCopyright } from "./copyright_controller";

router.get("/", getCopyright);
router.patch("/", updateCopyright);

export default router;
