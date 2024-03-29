import * as bcrypt from "bcrypt";
export class PasswordHash {
  /**
   *
   * @param plainPassword
   * Plain password returns hashed password
   */
  public static async hashPassword(plainPassword: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    return hashedPassword;
  }


  /**
   * 
   * @param plainPassword 
   * @param hashedPassword 
   * Compare plain text password and hashed password
   */
  public static async isPasswordValid(plainPassword: string, hashedPassword: string) {
      return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
