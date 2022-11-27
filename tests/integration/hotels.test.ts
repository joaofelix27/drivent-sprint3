import app, { init } from "@/app";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { createEnrollmentWithAddress, createUser, createTicket, createRemoteWithoutHotelTicketType, createRemoteWithHotelTicketType } from "../factories";
import { createHotel } from "../factories/hotels-factory";
import { createRooms } from "../factories/rooms-factory";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /hotels", () => {
  describe("when token is invalid", () => {
    it("should respond with status 401 if no token is given", async () => {
      const response = await server.get("/hotels/");

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
      const token = faker.lorem.word();

      const response = await server.get("/hotels/").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

      const response = await server.get("/hotels/").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe("when token is valid", () => {
    it("should respond with status 404 if there is no enrollment for the userId", async () => {
      const token = await generateValidToken();

      const response = await server.get("/hotels/").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it("should respond with status 404 if there is no ticket for the enrollmentId", async () => {
      const user = await createUser();
      await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);
  
      const response = await server.get("/hotels/").set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 401 if user ticket does not include hotel", async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);
      const ticketType = await createRemoteWithoutHotelTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    
      const response = await server.get("/hotels/").set("Authorization", `Bearer ${token}`);
    
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if user ticket was not payed yet", async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);
      const ticketType = await createRemoteWithHotelTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    
      const response = await server.get("/hotels/").set("Authorization", `Bearer ${token}`);
    
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 200 if everything is ok", async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);
      const ticketType = await createRemoteWithHotelTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createHotel();
    
      const response = await server.get("/hotels/").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            image: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          })])
      );
    });
  });
});

describe("GET /hotels/:hotelId", () => {
  describe("when token is invalid", () => {
    it("should respond with status 401 if no token is given", async () => {
      const hotel = await createHotel();
      const hotelId = hotel?.id;
      const response = await server.get(`/hotels/${hotelId}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
      const token = faker.lorem.word();

      const response = await server.get("/hotels/").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
      const hotel = await createHotel();
      const hotelId = hotel?.id;

      const response = await server.get(`/hotels/${hotelId}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe("when token is valid", () => {
    it("should respond with status 404 if there is no enrollment for the userId", async () => {
      const token = await generateValidToken();
      const hotel = await createHotel();
      const hotelId = hotel?.id;

      const response = await server.get(`/hotels/${hotelId}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it("should respond with status 404 if there is no ticket for the enrollmentId", async () => {
      const user = await createUser();
      await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const hotelId = hotel?.id;
  
      const response = await server.get(`/hotels/${hotelId}`).set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 401 if user ticket does not include hotel", async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);
      const ticketType = await createRemoteWithoutHotelTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const hotelId = hotel?.id;
    
      const response = await server.get(`/hotels/${hotelId}`).set("Authorization", `Bearer ${token}`);
    
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if user ticket was not payed yet", async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);
      const ticketType = await createRemoteWithHotelTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const hotel = await createHotel();
      const hotelId = hotel?.id;
    
      const response = await server.get(`/hotels/${hotelId}`).set("Authorization", `Bearer ${token}`);
    
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 200 and with an empty Rooms array if there aren't any rooms in the database", async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);
      const ticketType = await createRemoteWithHotelTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const hotelId = hotel?.id;
    
      const response = await server.get(`/hotels/${hotelId}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          image: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          Rooms: expect.arrayContaining([])
        })
      );
    });

    it("should respond with status 200 if everything is ok", async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);
      const ticketType = await createRemoteWithHotelTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const hotelId = hotel?.id;
      await createRooms (hotelId);
    
      const response = await server.get(`/hotels/${hotelId}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          image: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          Rooms: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              capacity: expect.any(Number),
              hotelId: expect.any(Number),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            })
          ])
        })
      );
    });
  });
});
