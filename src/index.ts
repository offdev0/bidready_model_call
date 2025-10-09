import express from "express";
import cors from "cors";
import apiRoutes from "./routes/api"; // ensure you have .js if using ES modules

const app = express();

// ✅ Enable CORS for all origins (you can restrict later)
app.use(cors());

// Parse JSON
app.use(express.json());

// API routes
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
