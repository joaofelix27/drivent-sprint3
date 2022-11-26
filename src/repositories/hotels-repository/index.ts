import { prisma } from "@/config";
import { Ticket, TicketStatus } from "@prisma/client";

async function findHotels() {
  return prisma.hotel.findMany();
}
async function findHotelWithRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    }
  });
}

const hotelsRepository = {
  findHotels,
  findHotelWithRoomsByHotelId,
};

export default hotelsRepository;
