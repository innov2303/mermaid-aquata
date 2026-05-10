import { Router, type IRouter } from "express";
import healthRouter from "./health";
import catalogueRouter from "./catalogue";
import remerciementsRouter from "./remerciements";
import presentationRouter from "./presentation";
import authRouter from "./auth";
import uploadRouter from "./upload";
import tvRefsRouter from "./tv-refs";
import contactRouter from "./contact";
import translateAllRouter from "./translate-all";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(uploadRouter);
router.use(catalogueRouter);
router.use(remerciementsRouter);
router.use(presentationRouter);
router.use(tvRefsRouter);
router.use(contactRouter);
router.use(translateAllRouter);

export default router;
