import {
        viewComment,
        addComment,
        updateComment,
        deleteComment
                     } from "../controllers/comment.controller";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";

const router=Router()

router.route('/:video_id').get(viewComment).post(verifyJWT,addCooment)
router.route('/:video_id').patch(verifyJWT,updateComment).delete(verifyJWT,deleteComment)



export default router