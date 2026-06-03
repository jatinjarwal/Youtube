import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb)  {
    cb(null, "./public/temp")}, // Specify the directory to save uploaded files   },  
    filename: function (req, file, cb)  {      
        cb(null, file.originalname); // create a unique filename using the current timestamp and original name
    }
});

const upload = multer({ storage: storage });    
export default upload;