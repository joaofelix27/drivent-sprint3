import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getHotelWithRoomsByHotelId, getHotels } from "@/controllers";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken)
  .get("/", getHotels)
  .get("/:hotelId", getHotelWithRoomsByHotelId);

export { hotelsRouter };
