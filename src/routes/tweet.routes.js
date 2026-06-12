import { createTweet,
        getUserTweets,
        updateTweet,
        deleteTweet
        
 } from "../controllers/tweet.controller";

 import {Router} from "express"
 const router=Router()

 import { verifyJWT } from "../middlewares/auth.middleware";

 router.route('/').post(verifyJWT,createTweet).get(verifyJWT,getUserTweets)

 router.route('/:tweet_id').patch(verifyJWT,updateTweet).delete(verifyJWT,deleteTweet)

 export default router 