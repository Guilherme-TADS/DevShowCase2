import app from './app';

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor DevShowcase API rodando em http://localhost:${PORT}`);
});
