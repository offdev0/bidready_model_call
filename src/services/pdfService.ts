import { writeFileSync, readdirSync, readFileSync, unlinkSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { execFileSync } from "child_process";

type ImageResult = { filename: string; data: string };

// Converts a PDF buffer to PNG images (one per page) using `pdftoppm`.
// Returns array of { filename, data: base64 }.
export const pdfToImages = (pdfBuffer: Buffer): ImageResult[] => {
  // Create a unique temp prefix
  const prefix = `pdf_${Date.now()}_${Math.round(Math.random() * 1e6)}`;
  const tmpDir = tmpdir();
  const pdfPath = join(tmpDir, `${prefix}.pdf`);
  const outPrefix = join(tmpDir, `${prefix}`); // pdftoppm will append -1, -2 ...

  try {
    // Write PDF to temp
    writeFileSync(pdfPath, pdfBuffer);

    // Run pdftoppm to produce PNGs: pdftoppm -png input.pdf outPrefix
    // This should produce files like `${outPrefix}-1.png`, `${outPrefix}-2.png`, ...
    execFileSync("pdftoppm", ["-png", pdfPath, outPrefix]);

    // Read generated PNG files
    const files = readdirSync(tmpDir).filter((f) => f.startsWith(prefix) && f.endsWith(".png"));
    // Sort files by page number (lexicographic works because of suffix -1, -2...)
    files.sort();

    const results: ImageResult[] = files.map((f) => {
      const full = join(tmpDir, f);
      const buffer = readFileSync(full);
      const base64 = buffer.toString("base64");
      return { filename: f, data: base64 };
    });

    return results;
  } catch (err: any) {
    // If pdftoppm is not installed, execFileSync will throw with code 'ENOENT'.
    if (err && (err.code === "ENOENT" || (err.message && /pdftoppm.*ENOENT/i.test(err.message)))) {
      throw new Error(
        "PDF conversion failed: 'pdftoppm' binary not found. Install Poppler (provides pdftoppm).\n" +
          "macOS: brew install poppler\n" +
          "Ubuntu/Debian: sudo apt-get install poppler-utils\n" +
          "Windows: install Poppler for Windows and add its 'bin' folder to PATH\n" +
          "After installing, verify with: pdftoppm -v"
      );
    }

    throw new Error(`PDF conversion failed: ${err.message || String(err)}`);
  } finally {
    // Best-effort cleanup: remove the temp pdf and any pngs matching prefix
    try {
      unlinkSync(pdfPath);
    } catch (_) {}
    try {
      // remove pngs
      const pngs = readdirSync(tmpDir).filter((f) => f.startsWith(prefix) && f.endsWith(".png"));
      for (const p of pngs) {
        try {
          unlinkSync(join(tmpDir, p));
        } catch (_) {}
      }
    } catch (_) {}
  }
};

export default pdfToImages;
