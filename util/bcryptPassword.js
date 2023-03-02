import bcrypt from "bcrypt"

export const bcryptPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 8);
  } catch (e) {
    console.log(e);
  }
};