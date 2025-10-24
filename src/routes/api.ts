import { Router } from "express";
import multer from "multer";
import { detectImage, pdfToImages } from "../controllers/apiController";

const router = Router();

// Configure multer for memory storage for images
const uploadImages = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Configure multer for memory storage for PDFs
const uploadPdfs = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed!"));
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

router.post("/detect", uploadImages.any(), detectImage);
router.post("/pdf-to-images", uploadPdfs.any(), pdfToImages);

export default router;
