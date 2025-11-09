import express from "express";
import { UserController } from "../controller/UserController.js";


const router = express.Router();

router.get("/", UserController.list);
router.get("/:id", UserController.get);
router.post("/", UserController.create);
router.put("/:id", UserController.update);
router.patch("/:id/status", UserController.toggleStatus);
router.delete("/:id", UserController.delete);

export default router;
