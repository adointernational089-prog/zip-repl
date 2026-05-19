import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import appsRouter from "./apps.js";
import messagesRouter from "./messages.js";
import adminRouter from "./admin.js";
import setupRouter from "./setup.js";
import projectsRouter from "./projects.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/apps", appsRouter);
router.use("/messages", messagesRouter);
router.use("/admin", adminRouter);
router.use("/projects", projectsRouter);
router.use(setupRouter);

export default router;
