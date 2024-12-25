import { faker } from "@faker-js/faker";
import httpMocks from "node-mocks-http";

import {
  createChatValidator,
  inviteUserToChatValidator,
  updateChatValidator,
  deleteChatValidator,
} from "../chat";
import {
  userRepository,
  chatRepository,
  chatsUsersRepository,
} from "../../../lib/repositories";
import { createUser, createChat, createUuid } from "../../../test-builders";

describe("Chat validators", () => {
  describe("createChatValidator", () => {
    it("should validate successfully", () => {
      const request = httpMocks.createRequest({
        method: "POST",
        url: "/chat",
        body: {
          title: faker.lorem.sentence(),
        },
      });

      const response = httpMocks.createResponse();

      const nextMock = jest.fn();

      createChatValidator(request, response, nextMock);

      expect(nextMock).toHaveBeenCalled();
    });

    it("should return an error if title is not provided", () => {
      const request = httpMocks.createRequest({
        method: "POST",
        url: "/chat",
        body: {
          title: "",
        },
      });

      const response = httpMocks.createResponse();

      createChatValidator(request, response, jest.fn());

      const data = response._getData();

      expect(response.statusCode).toBe(400);
      expect(data).toBe("Title is required");
    });
  });

  describe("inviteUserToChatValidator", () => {
    it("should validate successfully", async () => {
      const user = createUser();
      const chat = createChat({ creator: user });
      const inviteUser = createUser();

      const request = httpMocks.createRequest({
        method: "POST",
        url: `/chat/${chat.id}/invite`,
        body: {
          userId: inviteUser.id,
        },
        user,
      });

      jest.spyOn(userRepository, "findOne").mockResolvedValue(inviteUser);
      jest.spyOn(chatRepository, "findOne").mockResolvedValue(chat);
      jest.spyOn(chatsUsersRepository, "findOne").mockResolvedValue(null);

      const response = httpMocks.createResponse();

      const nextMock = jest.fn();

      await inviteUserToChatValidator(request, response, nextMock);

      expect(nextMock).toHaveBeenCalled();
    });

    it("should return an error if chat not found", async () => {
      const user = createUser();
      const inviteUser = createUser();

      const request = httpMocks.createRequest({
        method: "POST",
        url: "/chat/1/invite",
        body: {
          userId: createUser().id,
        },
        user: createUser(),
      });

      jest.spyOn(userRepository, "findOne").mockResolvedValue(createUser());
      jest.spyOn(chatRepository, "findOne").mockResolvedValue(null);

      const response = httpMocks.createResponse();

      await inviteUserToChatValidator(request, response, jest.fn());

      const data = response._getData();

      expect(response.statusCode).toBe(404);
      expect(data).toEqual({ message: "Chat not found" });
    });

    it("should return an error if user not found", async () => {
      const user = createUser();
      const chat = createChat({ creator: user });

      const request = httpMocks.createRequest({
        method: "POST",
        url: "/chat/1/invite",
        body: {
          userId: createUser().id,
        },
        user: createUser(),
      });

      jest.spyOn(userRepository, "findOne").mockResolvedValue(null);
      jest.spyOn(chatRepository, "findOne").mockResolvedValue(chat);
      jest.spyOn(chatsUsersRepository, "findOne").mockResolvedValue(null);

      const response = httpMocks.createResponse();

      await inviteUserToChatValidator(request, response, jest.fn());

      const data = response._getData();

      expect(response.statusCode).toBe(400);
      expect(data).toEqual({ message: "User is not exist" });
    });

    it("should return an error if user is already in chat", async () => {
      const user = createUser();
      const chat = createChat({ creator: user });
      const inviteUser = createUser();

      const request = httpMocks.createRequest({
        method: "POST",
        url: `/chat/${chat.id}/invite`,
        body: {
          userId: createUser().id,
        },
        user: createUser(),
      });

      jest.spyOn(userRepository, "findOne").mockResolvedValue(inviteUser);
      jest.spyOn(chatRepository, "findOne").mockResolvedValue(chat);
      jest.spyOn(chatsUsersRepository, "findOne").mockResolvedValue({
        id: createUuid(),
        user: inviteUser,
        chat,
      });

      const response = httpMocks.createResponse();

      await inviteUserToChatValidator(request, response, jest.fn());

      const data = response._getData();

      expect(response.statusCode).toBe(400);
      expect(data).toEqual({ message: "User is already in chat" });
    });
  });

  describe("updateChatValidator", () => {
    it("should validate successfully", async () => {
      const chat = createChat();
      const request = httpMocks.createRequest({
        method: "PATCH",
        url: `/chat/${chat.id}`,
        user: chat.creator,
        params: {
          id: chat.id,
        },
        body: {
          title: faker.lorem.sentence(),
        },
      });

      const response = httpMocks.createResponse();

      jest.spyOn(chatRepository, "findOne").mockResolvedValue(chat);

      const nextMock = jest.fn();

      await updateChatValidator(request, response, nextMock);

      expect(nextMock).toHaveBeenCalled();
    });

    it("should return an error if title is not provided", async () => {
      const chat = createChat();
      const request = httpMocks.createRequest({
        method: "PATCH",
        url: `/chat/${chat.id}`,
        user: chat.creator,
        params: {
          id: chat.id,
        },
        body: {
          title: "",
        },
      });

      const response = httpMocks.createResponse();

      jest.spyOn(chatRepository, "findOne").mockResolvedValue(chat);

      await updateChatValidator(request, response, jest.fn());

      const data = response._getData();

      expect(response.statusCode).toBe(400);
      expect(data).toBe("Title is required");
    });

    it("should return an error if chat is not exist", async () => {
      const chat = createChat();
      const request = httpMocks.createRequest({
        method: "PATCH",
        url: `/chat/${chat.id}`,
        user: chat.creator,
        params: {
          id: chat.id,
        },
        body: {
          title: faker.lorem.sentence(),
        },
      });

      const response = httpMocks.createResponse();

      jest.spyOn(chatRepository, "findOne").mockResolvedValue(null);

      await updateChatValidator(request, response, jest.fn());

      const data = response._getData();

      expect(response.statusCode).toBe(404);
      expect(data).toMatchObject({ message: "Chat not found" });
    });
  });

  describe("deleteChatValidator", () => {
    it("should validate successfully", async () => {
      const chat = createChat();
      const request = httpMocks.createRequest({
        method: "DELETE",
        url: `/chat/${chat.id}`,
        user: chat.creator,
        params: {
          id: chat.id,
        },
      });

      const response = httpMocks.createResponse();

      jest.spyOn(chatRepository, "findOne").mockResolvedValue(chat);

      const nextMock = jest.fn();

      await deleteChatValidator(request, response, nextMock);

      expect(nextMock).toHaveBeenCalled();
    });

    it("should return an error if chat is not exist", async () => {
      const chat = createChat();
      const request = httpMocks.createRequest({
        method: "DELETE",
        url: `/chat/${chat.id}`,
        user: chat.creator,
        params: {
          id: chat.id,
        },
      });

      const response = httpMocks.createResponse();

      jest.spyOn(chatRepository, "findOne").mockResolvedValue(null);

      await deleteChatValidator(request, response, jest.fn());

      const data = response._getData();

      expect(response.statusCode).toBe(404);
      expect(data).toMatchObject({ message: "Chat not found" });
    });
  });
});
