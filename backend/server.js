// backend/server.js
require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware para JSON
app.use(express.json());

// Rota de exemplo
app.get("/api/teste", (req, res) => {
  res.json({ message: "Backend funcionando!", env: process.env.NODE_ENV });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
