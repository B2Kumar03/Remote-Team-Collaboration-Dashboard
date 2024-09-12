import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Define the storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Provide the path to the temp folder inside the public directory
    cb(null, path.join(__dirname, '../public/temp'));
  },
  filename: function (req, file, cb) {
    // Use the original file name
    cb(null, file.originalname);
  }
});

// Create the multer instance



export const upload = multer({ 
  storage, 
})