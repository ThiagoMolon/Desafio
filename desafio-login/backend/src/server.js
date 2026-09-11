const express = require("express");
const cors = require("cors");
const pool = require("./config/database");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(userRoutes);

app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "ok",
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Banco indisponível" });
  }
});

async function startServer() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
      token_hash CHAR(64) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      used_at TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  app.listen(PORT, () => {
    console.log(`Backend rodando em http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Não foi possível iniciar o backend:", error);
  process.exit(1);
});