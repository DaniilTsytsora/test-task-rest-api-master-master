// Запуск сервера и коннект к БД.
import express from 'express';
import mongoose from 'mongoose';
import router from './router.js';
const PORT = 5000;
const URL_BD = 'mongodb://127.0.0.1:27017/';

const app = express();
app.use(express.json());
app.use('/auth', router);

async function startApp() {
  try {
    await mongoose.connect(URL_BD);
    app.listen(PORT, () => console.log(`Server working on PORT ${PORT}`));
  } catch (e) {
    console.log(e);
  }
}
startApp();
