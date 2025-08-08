import z from "zod";

export const UserValidation =  z.object({
  username : z.string().min(3, "Username must be at least 3 characters long").max(20, "Username must not exceed 20 characters"),
  email : z.email().min(1,"email is required"),
  profilePictureUrl : z.string().optional(),
  password : z.string().min(6, "Password must be at least 6 characters long")
})

export const LoginValidation = z.object({
  email: z.email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long")
});