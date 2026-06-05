import { Router } from "express";
import {
     loginUser,
     registerUser,
     logoutUser,
     refreshAccessToken,
     getCurrentUser,
     updateUserPassword,
     updateUserDetails,
     updateUserAvatar,
     updateUserCoverImage,
     getUserChannelProfile} from "../controllers/user.controller.js";  

import upload from "../middlewares/multer.middleware.js";  
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router = Router();


router.route('/register')
    .post(upload.fields([{ name: "avatar", maxCount: 1 },
         { name: "coverImage", maxCount: 1 }]),
          registerUser);

router.route('/login')
    .post(loginUser);

router.route('/logout')
    .post(verifyJWT,logoutUser);  

router.route('/refresh-token')
    .post(refreshAccessToken);

router.route('/update-password')
    .put(verifyJWT, updateUserPassword);

router.route('/update-profile')
    .put(verifyJWT, updateUserDetails);

router.route('/update-avatar')
    .put(verifyJWT,
        upload.single("avatar"),
        updateUserAvatar);

router.route('/update-cover-image')
    .put(verifyJWT, 
        upload.single("coverImage"),
        updateUserCoverImage);

router.route('/username/:username')
    .get(verifyJWT,getUserChannelProfile);

export default router;