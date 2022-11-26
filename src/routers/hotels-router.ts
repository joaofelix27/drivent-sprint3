import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getHotelsById, getHotels } from "@/controllers";

const hotelsRouter = Router();

hotelsRouter
  // .all("/*", authenticateToken)
  .get("/", getHotels)
  .get("/:hotelId", getHotelsById);

export { hotelsRouter };
