import bcrypt from "bcrypt"

export const bcryptPassword = async (password) => {
  return await bcrypt.hash(password, 8);
};