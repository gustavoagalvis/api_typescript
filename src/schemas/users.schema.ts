import mongoose from "mongoose";
import { User } from "../types/user.types";


const userSchema = new mongoose.Schema<User>({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const UserSchema = mongoose.model("users", userSchema);
export { UserSchema };