import { faker } from "@faker-js/faker";
import httpMocks from "node-mocks-http";
import bcrypt from "bcryptjs";

import {
  registrationValidator,
  loginValidator,
  refreshTokenValidator,
} from "../auth";
import { userRepository, tokenRepository } from "../../../lib/repositories";
import { createUser } from "../../../test-builders";

const bcryptCompareSyncSpy = jest.spyOn(bcrypt, "compareSync");

describe("Auth validators", () => {
  describe("registrationValidator", () => {
    it("should validate successfully", async () => {
      const request = httpMocks.createRequest({
        method: "POST",
        url: "/auth/register",
        body: {
          email: faker.internet.email(),
          password: faker.internet.password(),
        },
      });

      jest.spyOn(userRepository, "findOne").mockResolvedValue(null);

      const response = httpMocks.createResponse();

      const nextMock = jest.fn();

      await registrationValidator(request, response, nextMock);

      expect(nextMock).toHaveBeenCalled();
    });

    it("should return an error if email is not provided", async () => {
      const request = httpMocks.createRequest({
        method: "POST",
        url: "/auth/register",
        body: {
          email: "",
          password: faker.internet.password(),
        },
      });

      jest.spyOn(userRepository, "findOne").mockResolvedValue(null);

      const response = httpMocks.createResponse();

      await registrationValidator(request, response, jest.fn());

      const data = response._getData();

      expect(response.statusCode).toBe(400);
      expect(data).toBe("Email and password are required");
    });

    it("should return an error if password is not provided", async () => {
      const request = httpMocks.createRequest({
        method: "POST",
        url: "/auth/register",
        body: {
          email: faker.internet.email(),
          password: null,
        },
      });

      jest.spyOn(userRepository, "findOne").mockResolvedValue(null);

      const response = httpMocks.createResponse();

      await registrationValidator(request, response, jest.fn());

      const data = response._getData();

      expect(response.statusCode).toBe(400);
      expect(data).toBe("Email and password are required");
    });

    it("should return an error if a user with this email is exist", async () => {
      const email = faker.internet.email();
      const request = httpMocks.createRequest({
        method: "POST",
        url: "/auth/register",
        body: {
          email,
          password: faker.internet.password(),
        },
      });

      jest
        .spyOn(userRepository, "findOne")
        .mockResolvedValue(createUser({ email }));

      const response = httpMocks.createResponse();

      await registrationValidator(request, response, jest.fn());

      const data = response._getData();

      expect(response.statusCode).toBe(409);
      expect(data).toBe("User with this email already exists");
    });
  });

  describe("loginValidator", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should validate successfully", async () => {
      const email = faker.internet.email();
      const request = httpMocks.createRequest({
        method: "POST",
        url: "/auth/login",
        body: {
          email,
          password: faker.internet.password(),
        },
      });

      jest
        .spyOn(userRepository, "findOne")
        .mockResolvedValue(createUser({ email }));

      const response = httpMocks.createResponse();

      const nextMock = jest.fn();
      bcryptCompareSyncSpy.mockReturnValue(true);

      await loginValidator(request, response, nextMock);

      expect(nextMock).toHaveBeenCalled();
    });

    it("should return an error if email is not provided", async () => {
      const request = httpMocks.createRequest({
        method: "POST",
        url: "/auth/login",
        body: {
          email: "",
          password: faker.internet.password(),
        },
      });

      jest.spyOn(userRepository, "findOne").mockResolvedValue(null);

      const response = httpMocks.createResponse();

      await loginValidator(request, response, jest.fn());

      const data = response._getData();

      expect(response.statusCode).toBe(400);
      expect(data).toBe("Email and password are required");
    });

    it("should return an error if password is not provided", async () => {
      const request = httpMocks.createRequest({
        method: "POST",
        url: "/auth/login",
        body: {
          email: faker.internet.email(),
          password: null,
        },
      });

      jest.spyOn(userRepository, "findOne").mockResolvedValue(null);

      const response = httpMocks.createResponse();

      await loginValidator(request, response, jest.fn());

      const data = response._getData();

      expect(response.statusCode).toBe(400);
      expect(data).toBe("Email and password are required");
    });

    it("should return an error if user is not exist", async () => {
      const email = faker.internet.email();

      const request = httpMocks.createRequest({
        method: "POST",
        url: "/auth/login",
        body: {
          email: faker.internet.email(),
          password: faker.internet.password(),
        },
      });

      jest
        .spyOn(userRepository, "findOne")
        .mockResolvedValue(createUser({ email }));

      const response = httpMocks.createResponse();
      bcryptCompareSyncSpy.mockReturnValue(false);

      await loginValidator(request, response, jest.fn());

      const data = response._getData();

      expect(response.statusCode).toBe(404);
      expect(data).toBe("Authentication failed");
    });
  });

  describe("refreshTokenValidator", () => {
    it("should validate successfully", async () => {
      const refreshToken = faker.string.uuid();
      const request = httpMocks.createRequest({
        method: "POST",
        url: "/auth/refresh",
        cookies: {
          refreshToken,
        },
      });

      jest
        .spyOn(tokenRepository, "findOne")
        .mockResolvedValue({ refreshToken } as any);

      const response = httpMocks.createResponse();

      const nextMock = jest.fn();

      await refreshTokenValidator(request, response, nextMock);

      expect(nextMock).toHaveBeenCalled();
    });

    it("should return an error if refreshToken is not provided", async () => {
      const request = httpMocks.createRequest({
        method: "POST",
        url: "/auth/refresh",
        cookies: {
          refreshToken: "",
        },
      });

      jest.spyOn(tokenRepository, "findOne").mockResolvedValue(null);

      const response = httpMocks.createResponse();

      await refreshTokenValidator(request, response, jest.fn());

      const data = response._getData();

      expect(response.statusCode).toBe(404);
      expect(data).toBe("Authentication failed");
    });

    it("should return an error if token is not exist", async () => {
      const refreshToken = faker.string.uuid();
      const request = httpMocks.createRequest({
        method: "POST",
        url: "/auth/refresh",
        cookies: {
          refreshToken,
        },
      });

      jest.spyOn(tokenRepository, "findOne").mockResolvedValue(null);

      const response = httpMocks.createResponse();

      await refreshTokenValidator(request, response, jest.fn());

      const data = response._getData();

      expect(response.statusCode).toBe(404);
      expect(data).toBe("Authentication failed");
    });
  });
});
