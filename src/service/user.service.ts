import { randomBytes, pbkdf2Sync } from "crypto"
import { LoginValidation, UserValidation } from "../schemas/user.schema.js";
import prismaClient from "../lib/prismaClient.js";
import jwt from "jsonwebtoken"

export interface UserPayload {
  email: string;
  username: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

class UserService {

  private static get JWT_TOKEN() : string {
    const token = process.env.JWT_TOKEN;
    if (!token) {
      throw new Error("JWT_TOKEN is not defined");
    }
    return token;
  }

  public static decodeJWT = (token:string) => {
    return jwt.verify(token, this.JWT_TOKEN);
  }

  private static createSalt(): string {
    // Logic to create a salt
    const salt = randomBytes(32).toString("hex");
    return salt;
  }

  private static hashPassword(password: string, salt: string): string {
    // Logic to hash the password with the salt
    const iterations = 100000;
    const keylen = 64;
    const digest = "sha512";
    const hashed = pbkdf2Sync(password, salt, iterations, keylen, digest).toString("hex");
    return hashed;
  }

  public static async createUser(data: UserPayload) {
    try {
      const { password, email, username, profilePictureUrl } = UserValidation.parse(data);
      const salt = this.createSalt();
      const hashedPassword = this.hashPassword(password, salt);
      const newUser = await prismaClient.user.create({
        data:{
          username,
          email,
          password : hashedPassword,
          salt,
          profileImageUrl : profilePictureUrl || null
        }
      })

      return newUser.id;
    } catch (error : any) {
      return new Error(error);
    }

  }

  public static async loginUser(data: LoginPayload) {
    try {
      console.log("Attempting login for:", data.email);
      const { email, password } = LoginValidation.parse(data);
      const user = await prismaClient.user.findUnique({
        where: { email }
      });

      if (!user) {
        throw new Error("User not found");
      }

      const hashedPassword = this.hashPassword(password, user.salt);
      if (hashedPassword !== user.password) {
        throw new Error("Invalid password");
      }


      const token = jwt.sign({email, username:user.username ,id:user.id, profilePictureUrl : user.profileImageUrl}, this.JWT_TOKEN, {
        expiresIn: '7d'
      })
      
      return token
    } catch (error: any) {
    
      return new Error(error);
    }
  }

  public static async updateUser(id: string, data: UserPayload) {
    // Logic to update a user
  }

  public static async deleteUser(id: string) {
    // Logic to delete a user
  }
}


export default UserService;