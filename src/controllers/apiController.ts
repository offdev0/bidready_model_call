import { Request, Response } from "express";
import { detect } from "../services/roboflowService";

export const detectImage = async (req: Request, res: Response) => {
  console.log("=======>api called");
  try {
    // Check if files were uploaded (using upload.any())
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "Image file is required." });
    }

    // Get the first uploaded file
    const file = files[0];

    // Convert uploaded file buffer to base64
    const imageBase64 = file.buffer.toString("base64");

    const result = await detect(imageBase64);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
