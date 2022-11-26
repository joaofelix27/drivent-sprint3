import { notFoundError, unauthorizedError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotels-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getHotels() {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(1);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if(!ticket?.TicketType?.includesHotel || ticket?.status!=="PAID" ) {
    throw unauthorizedError();
  }

  const hotels = await hotelsRepository.findHotels();

  return hotels;
}

async function getHotelsById() {
  // const enrollment = await hotelsRepository.findWithAddressByUserId(userId);
  // if (!enrollment) {
  //   throw notFoundError();
  // }
  // const ticket = await hotelsRepository.findTicketByEnrollmentId(enrollment.id);
  // if (!ticket) {
  //   throw notFoundError();
  // }

  // return ticket;
}

const hotelsService = {
  getHotels,
  getHotelsById,
};

export default hotelsService;
