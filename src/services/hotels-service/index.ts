import { notFoundError } from "@/errors";
import hotelsRepository from "@/repositories/hotels-repository";

async function getHotels() {
  const tickets = await hotelsRepository.findHotels();

  const ticketsWithHotels =  tickets.filter( (ticket) => {
    if(ticket?.TicketType?.includesHotel && ticket?.status=="PAID" ) {
      return true;
    } });

  if (!ticketsWithHotels.length) {
    throw notFoundError();
  }
  return ticketsWithHotels;
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
