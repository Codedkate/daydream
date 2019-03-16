import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler, notFoundRoute } from './middleware';
import {
  authRoutes,
  userRoutes,
  noteRoutes,
} from './routes';

dotenv.config();

const app = express();

app.enable('trust proxy');
app.use(cors());

app.use(require('morgan')('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/notes', noteRoutes);
app.use(notFoundRoute);
app.use(errorHandler);

export default app;
