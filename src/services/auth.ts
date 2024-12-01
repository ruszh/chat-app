import bcrypt from "bcrypt";
import { dataSource } from "../app-data-source";
import { User } from "../entity/user.entity";
import { Token } from "../entity/token.entity";
import { generateAccessToken, generateRefreshToken } from "../utils/auth";

export default class AuthService {
  static registration = async ({
    email,
    password,
    userName,
  }: {
    email: string;
    password: string;
    userName: string;
  }) => {
    const userRepository = dataSource.getRepository(User);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = userRepository.create({
      userName,
      email,
      password: hashedPassword,
    });

    const result = await userRepository.save(newUser);

    return result;
  };
  static login = async ({ email }: { email: string }) => {
    const userRepository = dataSource.getRepository(User);
    const tokenRepository = dataSource.getRepository(Token);

    const user = await userRepository.findOne({
      where: { email },
    });

    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken();

    const newToken = tokenRepository.create({
      refreshToken,
      user,
    });

    await tokenRepository.save(newToken);

    return { accessToken, refreshToken };
  };
  static refreshToken = async (refreshToken: string) => {
    const tokenRepository = dataSource.getRepository(Token);

    const token = await tokenRepository.findOne({
      where: { refreshToken },
      relations: ["user"],
    });

    const newAccessToken = generateAccessToken(token.user);

    const newRefreshToken = generateRefreshToken();

    const newToken = tokenRepository.create({
      refreshToken: newRefreshToken,
      user: token.user,
    });

    await tokenRepository.save(newToken);
    await tokenRepository.remove(token);

    return { newAccessToken, newRefreshToken };
  };
}
