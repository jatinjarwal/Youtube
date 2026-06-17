import {Router} from "express"
import { toggleSubscribeStatus,
         subscribedChannel
 } from "../controllers/subscription.controller.js"

 import { verifyJWT } from "../middlewares/auth.middleware.js"

 const router= Router()
 router.use(verifyJWT)

 router.route('/channel/:channel_id').post(toggleSubscribeStatus)
 router.route('/subscribed-channels').get(subscribedChannel)
 export default router