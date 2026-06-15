import {Router} from "express"

import{
    videoLike,
    commentLike,
    tweetLike,
    getLikedVideos
} from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router= Router()
router.use(verifyJWT)

router.route('/toggle/v/:video_id').post(videoLike)
router.route('/toggle/c/:comment_id').post(commentLike)
router.route('/toggle/t/:tweet_id').post(tweetLike)
router.route('/videos').get(getLikedVideos)


export default router