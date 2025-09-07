import { hash } from 'bcrypt';

export async function hashPassword(password: string) {
  const salt = 6;
  const hashedPassword = await hash(password, salt);

  return hashedPassword;
}
