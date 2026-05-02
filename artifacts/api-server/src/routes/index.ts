import { Router, type IRouter } from "express";
import healthRouter from "./health";
import catalogueRouter from "./catalogue";
import remerciementsRouter from "./remerciements";
import presentationRouter from "./presentation";
import authRouter from "./auth";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(uploadRouter);
router.use(catalogueRouter);
router.use(remerciementsRouter);
router.use(presentationRouter);

export default router;
