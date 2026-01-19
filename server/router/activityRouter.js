import express from "express";
import { getAllActivities } from "../controller/activityController.js";

const activityRouter = express.Router();

activityRouter.get("/recentActivities", getAllActivities);

export default activityRouter;