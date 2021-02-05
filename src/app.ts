import * as express from "express";
import * as dotenv from "dotenv";
import { Database } from "./database";

// routes imports
import usersRoutes from "./routes/users.routes";
import authRoutes from "./routes/auth.routes";

dotenv.config();

// create and setup express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

Database.initialize();

// register routes
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);

const port = process.env.PORT || 4000;
// start express server
app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
