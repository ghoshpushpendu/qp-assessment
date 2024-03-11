import express, { Express } from "express";
import dotenv from "dotenv";
import { testDbConnection } from "./database";
import userRouter from "./routes/user";
import authenticationRouter from "./routes/authentication";
import groceryItemsRouter from './routes/groceryItems';
import cartItemsRouter from './routes/cartItems';
import authorization from "./middlewares/authorization";
import http from "http";

dotenv.config();

console.log(process.env.DB_HOST);

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/authenticate', authenticationRouter);
app.use('/user', authorization.authorize, userRouter);
app.use('/groceryItems', authorization.authorize, groceryItemsRouter);
app.use('/cartItems', authorization.authorize, cartItemsRouter);
testDbConnection();

const server : http.Server = new http.Server(app);

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  console.log(`[server]: Press CTRL + C to stop server`);
});

export default server;