import { faker } from "@faker-js/faker";
import httpMocks from "node-mocks-http";

import { createMessageValidator } from "../message";
import { createMessage, createChat, createUser } from "../../../test-builders";
import { chatRepository, messageRepository } from "../../../lib/repositories";

describe("Message validators", () => {
  describe("createMessageValidator", () => {
    it("should validate successfully", async () => {
      const chat = createChat();
      const request = httpMocks.createRequest({
        method: "POST",
        url: "/message",
        body: {
          text: faker.lorem.sentence(),
          chatId: chat.id,
        },
      });

      const response = httpMocks.createResponse();

      const nextMock = jest.fn();

      jest.spyOn(chatRepository, "findOne").mockResolvedValue(chat);

      await createMessageValidator(request, response, nextMock);

      expect(nextMock).toHaveBeenCalled();
    });

    it("should validate successfully with replied message", async () => {
      const chat = createChat();
      const repliedMessage = createMessage({
        chat,
        forwardedFromUser: createUser(),
        forwardedFromChat: createChat(),
      });
      const request = httpMocks.createRequest({
        method: "POST",
        url: "/message",
        body: {
          text: faker.lorem.sentence(),
          chatId: chat.id,
          repliedMessageId: repliedMessage.id,
        },
      });

      const response = httpMocks.createResponse();

      const nextMock = jest.fn();

      jest.spyOn(chatRepository, "findOne").mockResolvedValue(chat);
      jest
        .spyOn(messageRepository, "findOne")
        .mockResolvedValue(repliedMessage);

      await createMessageValidator(request, response, nextMock);

      expect(nextMock).toHaveBeenCalled();
    });

    it("should return an error if text is not provided", async () => {
      const request = httpMocks.createRequest({
        method: "POST",
        url: "/message",
        body: {
          text: "",
          chatId: faker.string.uuid(),
        },
      });

      const response = httpMocks.createResponse();

      await createMessageValidator(request, response, jest.fn());

      const data = response._getData();

      expect(response.statusCode).toBe(400);
      expect(data).toBe("Text and chatId are required");
    });

    it("should return an error if chatId is not provided", () => {
      const request = httpMocks.createRequest({
        method: "POST",
        url: "/message",
        body: {
          text: faker.lorem.sentence(),
          chatId: "",
        },
      });

      const response = httpMocks.createResponse();

      createMessageValidator(request, response, jest.fn());

      const data = response._getData();

      expect(response.statusCode).toBe(400);
      expect(data).toBe("Text and chatId are required");
    });

    it("should return an error if chat not found", async () => {
      const request = httpMocks.createRequest({
        method: "POST",
        url: "/message",
        body: {
          text: faker.lorem.sentence(),
          chatId: faker.string.uuid(),
        },
      });

      const response = httpMocks.createResponse();

      jest.spyOn(chatRepository, "findOne").mockResolvedValue(null);

      await createMessageValidator(request, response, jest.fn());

      const data = response._getData();

      expect(response.statusCode).toBe(404);
      expect(data).toEqual({ message: "Chat not found" });
    });

    it("should return an error if replied message not found", async () => {
      const chat = createChat();
      const request = httpMocks.createRequest({
        method: "POST",
        url: "/message",
        body: {
          text: faker.lorem.sentence(),
          chatId: chat.id,
          repliedMessageId: faker.string.uuid(),
        },
      });

      const response = httpMocks.createResponse();
      jest.spyOn(chatRepository, "findOne").mockResolvedValue(chat);
      jest.spyOn(messageRepository, "findOne").mockResolvedValue(null);

      await createMessageValidator(request, response, jest.fn());

      const data = response._getData();

      expect(response.statusCode).toBe(404);
      expect(data).toEqual({ message: "Replied message not found" });
    });
  });
});
