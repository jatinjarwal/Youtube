import { 
    createPlaylist,
    addVideo,
    removeVideo,
    getPlaylistById,
    getUserPlaylists,
    deletePlaylist,
    updatePlaylist
 } from "../controllers/playlist.controller.js";

 import {Router} from "express"
 import {verifyJWT} from "../middlewares/auth.middleware.js"

 const router= Router()
 
 router.route('/').get(verifyJWT,getUserPlaylists).post(verifyJWT,createPlaylist)
 router.route('/:playlist_id').get(getPlaylistById).patch(verifyJWT,updatePlaylist)
 .delete(verifyJWT,deletePlaylist)
 router.route('/:playlist_id/v/:video_id').post(verifyJWT,addVideo).delete(verifyJWT,removeVideo)


 export default router