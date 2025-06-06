import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import auth from './routes/auth.js';
import api from './routes/api.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
}).then(() => {
  console.log(`[SERVER] Successfully Connected to MongoDB.`);
}).catch((err) => {
  console.error(err);
});

app.use(cors({
  credentials: true,
  origin: process.env.SERVER_CLIENT_URL,
}));

app.use(cookieParser());
app.use(express.json());

app.use("/auth", auth);
app.use("/api", api);

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`[SERVER] Server has started on port ${port}.`);
});

// No need for `module.exports = app;` in ESM
// Instead, you can `export default app;` if this file needs to be imported elsewhere
export default app;
