import { prisma } from "@/config";
import { Ticket, TicketStatus } from "@prisma/client";

async function findHotels() {
  return prisma.ticket.findMany({
    include: {
      TicketType: true,
    }
  });
}
async function findHotelsById(ticketId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
    include: {
      TicketType: true,
    }
  });
}

const hotelsRepository = {
  findHotels,
  findHotelsById,
};

export default hotelsRepository;
