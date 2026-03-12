import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Mock data for NGOs and Doctors
app.get("/api/ngos", (req, res) => {
  res.json([
    { id: '1', name: 'War Against Rape (WAR)', contact: '021-35373008', location: 'Karachi' },
    { id: '2', name: 'Rozan', contact: '0800-22444', location: 'Islamabad' },
  ]);
});

app.get("/api/doctors", (req, res) => {
  res.json([
    { id: '1', name: 'Dr. Sarah Ahmed', specialty: 'Trauma Specialist', contact: '0300-1234567', location: 'Lahore' },
  ]);
});

async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

// Only start the server if we're not in a serverless environment
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  setupVite().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
} else {
  // In Vercel, Vite is handled by the static build, so we just setup API routes
  // The vercel.json handles routing /api to this file
}

export default app;
