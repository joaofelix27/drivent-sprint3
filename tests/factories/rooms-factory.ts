import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createRooms(hotelId: number) {
  return prisma.room.createMany({
    data: [{
      name: faker.name.findName(),
      capacity: faker.datatype.number(),
      hotelId,
    },
    {
      name: faker.name.findName(),
      capacity: faker.datatype.number(),
      hotelId,
    }
    ]   
  });
}
