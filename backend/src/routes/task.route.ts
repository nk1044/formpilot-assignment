import express from "express";
import { createTask, getAllTasks, getTaskById, updateTask, deleteTask } from "../controller/task.controller.js";
import {verifyTask} from '../middleware/task.middleware.js';

const router = express.Router();

router.route("/tasks").post(verifyTask, createTask);
router.route("/tasks").get(verifyTask, getAllTasks);
router.route("/tasks/:txHash").get(verifyTask, getTaskById);
router.route("/tasks/:txHash").put(verifyTask, updateTask);
router.route("/tasks/:txHash").delete(verifyTask, deleteTask);

export default router;
