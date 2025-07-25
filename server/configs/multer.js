
// import multer from 'multer';
// import path from 'path';

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // assumes you run node from the <your-project>/server directory
//     cb(null, path.join(process.cwd(), 'uploads'));
//   },
//   filename: (req, file, cb) => {
//     const ext  = path.extname(file.originalname);
//     const name = path.basename(file.originalname, ext).replace(/\s+/g, '_');
//     cb(null, `${Date.now()}-${name}${ext}`);
//   },
// });

// export default multer({ storage });



// configs/multer.js
import multer from 'multer';

// Use multer’s memoryStorage so that `req.file.buffer` is populated
const storage = multer.memoryStorage();

export default multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,   // optional: limit files to 5MB
  },
});
