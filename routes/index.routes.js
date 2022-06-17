import express from "express";
import {
  addUser,
  depositUser,
  creditUser,
  withdrawUser,
  transferUsers,
  getUser,
  getAllUsers,
  deleteUser,
  getAllUsersSorted,
} from "../controllers/userControllers.js";

const rootRouter = express.Router();

rootRouter.post("/users", addUser);
rootRouter.put("/deposit/:id", depositUser);
rootRouter.put("/credit/:id", creditUser);
rootRouter.put("/withdraw/:id/:amount", withdrawUser);
rootRouter.put("/transfer", transferUsers);
rootRouter.get("/users/sorted", getAllUsersSorted);
rootRouter.get("/users/:id", getUser);
rootRouter.get("/users", getAllUsers);
rootRouter.delete("/users/:id", deleteUser);

export { rootRouter };
