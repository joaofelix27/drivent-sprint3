import { notFoundError, unauthorizedError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotels-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getHotels(userId: number) {
  await checkIfIncludeHotelAndPayed (userId);
  const hotels = await hotelsRepository.findHotels();

  return hotels;
}

async function checkIfIncludeHotelAndPayed(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket) {
    throw notFoundError();
  }
  
  if(!ticket?.TicketType?.includesHotel || ticket?.status!=="PAID" ) {
    throw unauthorizedError();
  }
}

async function getHotelWithRoomsByHotelId(hotelId: number, userId: number) {
  await checkIfIncludeHotelAndPayed (userId);

  const hotelsWithRooms = await hotelsRepository.findHotelWithRoomsByHotelId(hotelId);

  return hotelsWithRooms;
}

const hotelsService = {
  getHotels,
  getHotelWithRoomsByHotelId,
};

export default hotelsService;
