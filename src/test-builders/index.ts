import { faker } from "@faker-js/faker";
import { MessageStatus } from "../constants";

export const createUuid = faker.string.uuid;

export const createUser = (attributes = {}) => ({
  id: faker.string.uuid(),
  userName: faker.internet.username(),
  email: faker.internet.email(),
  createdAt: faker.date.recent(),
  password: faker.string.nanoid(),
  ...attributes,
});

export const createChat = (attributes = {}) => ({
  id: faker.string.uuid(),
  title: faker.lorem.sentence(),
  creator: createUser(),
  createdAt: faker.date.recent(),
  ...attributes,
});

export const createMessage = (attributes = {}) => ({
  id: faker.string.uuid(),
  text: faker.lorem.sentence(),
  status: faker.helpers.arrayElement([
    MessageStatus.Active,
    MessageStatus.Deleted,
  ]),
  chat: createChat(),
  user: createUser(),
  createdAt: faker.date.recent(),
  repliedMessage: null,
  forwardedFromUser: createUser(),
  forwardedFromChat: createChat(),
  ...attributes,
});
