import {
        viewComment,
        addComment,
        updateComment,
        deleteComment
                     } 
from "../controllers/comment.controller.js";

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()

router.route('/:video_id').get(viewComment).post(verifyJWT,addComment)
router.route('/update/:video_id').patch(verifyJWT,updateComment).delete(verifyJWT,deleteComment)



export default router