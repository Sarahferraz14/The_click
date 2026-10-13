import "dotenv/config";
import express from "express";
import path from "node:path";
import authRoutes from "./routes/auth.routes";

const app = express();
app.use(express.json());

// Serve o frontend (../frontend) na mesma origem da API: não precisa de CORS
app.use(express.static(path.resolve(process.cwd(), "../frontend")));
app.get("/", (_req, res) => res.redirect("/pages/the-click.html"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});