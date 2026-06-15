import {Router} from "express"
import { getVideos,
        getVideoById,
        publishVideo,
        updateVideo,
        togglePublishStatus,
        deleteVideo
     

 } from "../controllers/video.controller.js"
 
 import {verifyJWT} from "../middlewares/auth.middleware.js"
 import upload from "../middlewares/multer.middleware.js"


 const router=Router()
  router.use(verifyJWT)

 router.route('/').get(getVideos)
 .post(upload.fields([{name:"videoFile",maxCount:1},{name:"thumbnail",maxCount:1}]),publishVideo)

 router.route('/:video_id')
 .get(getVideoById)
 .patch(upload.single("thumbnail"),updateVideo)
 .delete(deleteVideo)

 router.route('/t/:video_id').patch(togglePublishStatus)
 
 


