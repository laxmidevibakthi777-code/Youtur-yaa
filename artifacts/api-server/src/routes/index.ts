import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import youtubeRouter from "./youtube.js";
import aiRouter from "./ai.js";
import { rateLimiter } from "../middlewares/rateLimiter.js";

const router: IRouter = Router();

router.use(rateLimiter);
router.use(healthRouter);
router.use('/youtube', youtubeRouter);
router.use('/ai', aiRouter);

export default router;
