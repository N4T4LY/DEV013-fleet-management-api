import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';
import { taxisRouter } from "./routes/taxisRoutes";
import { trajectoriesRouter } from "./routes/trajectoriesRoutes";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();

app.use(cors());
app.use(express.json());
app.use("/taxis", taxisRouter);
app.use("/trajectories", trajectoriesRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;