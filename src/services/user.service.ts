import { Database } from "../database";
import { UserDTO } from "../dto/user.dto";
import { User } from "../entity/User";

export class UserService {
  public static async findByEmail(email: string): Promise<User> {
    return await Database.userRepository.findOne({
      email,
    });
  }

  public static async findByEmailOrUsername(
    email: string,
    username: string
  ): Promise<User> {
    return await Database.userRepository
      .createQueryBuilder("user")
      .where("user.email = :email", { email })
      .orWhere("user.username = :username", { username })
      .getRawOne();
  }

  public static async findById(id: number): Promise<any> {
    const { password, ...rest } = await Database.userRepository.findOne(id);
    return rest;
  }

  public static async findAll(): Promise<User[]> {
    const users = await Database.userRepository.find();
    users.forEach((user) => delete user.password);
    return users;
  }

  public static async create(body: UserDTO): Promise<User> {
    return await Database.userRepository.save(body);
  }
}
