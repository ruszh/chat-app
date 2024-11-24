import { User } from "../types";

export const mapUserData = (user: User): Partial<User> => ({
  id: user.id,
  email: user.email,
  userName: user.userName,
});
