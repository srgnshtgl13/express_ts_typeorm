export enum UserRole {
  ADMIN = "admin",
  CHIEFEDITOR = "chiefeditor",
  EDITOR = "editor",
  USER = "user",
}

export class UserDTO {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}
