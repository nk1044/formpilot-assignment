import express from "express";
import { createTask, getAllTasks, getTaskById, updateTask, deleteTask } from "../controller/task.controller.js";
import {verifyTask} from '../middleware/task.middleware.js';

const router = express.Router();

router.route("/tasks").post(verifyTask, createTask);
router.route("/tasks").get(getAllTasks);
router.route("/tasks/:id").get(getTaskById);
router.route("/tasks/:id").put(updateTask);
router.route("/tasks/:id").delete(deleteTask);

export default router;
