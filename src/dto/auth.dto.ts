import { UserDTO } from "./user.dto";

export class AuthDTO {
  user: UserDTO;
  token: string;
  refresh_token: string;
}
