import { Router } from "express";
import{verifyJWT} from "../middlewares/auth.middleware.js"
import{channelStats,channelVideos
       
} from "../controllers/dashboard.controller.js"


const router=Router()

router.route('/').get(verifyJWT,channelStats)
router.route('/videos').get(verifyJWT,channelVideos)

export default router