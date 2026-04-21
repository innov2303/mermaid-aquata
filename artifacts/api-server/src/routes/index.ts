import { Router, type IRouter } from "express";
import healthRouter from "./health";
import catalogueRouter from "./catalogue";
import remerciementsRouter from "./remerciements";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(catalogueRouter);
router.use(remerciementsRouter);

export default router;
