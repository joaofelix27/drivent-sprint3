import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const hotels = await hotelsService.getHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }

    if (error.name === "UnauthorizedError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }
    
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function getHotelWithRoomsByHotelId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { hotelId } = req.params;
  try {
    const hotels = await hotelsService.getHotelWithRoomsByHotelId(Number(hotelId), userId);
    return res.status(httpStatus.OK).json(hotels);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }

    if (error.name === "UnauthorizedError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

