






import crypto from "crypto";


const ENCRYPTION_KEY = crypto
  .createHash("sha256")
  .update("my_super_secret_key")
  .digest();

const IV_LENGTH = 16;



export const generateEncryption = async (
  plaintext: string
): Promise<string> => {
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    ENCRYPTION_KEY,
    iv
  );

  let encrypted = cipher.update(plaintext, "utf-8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
};



export const generateDecryption = async (
  ciphertext: string
): Promise<string> => {
  const [ivHex, encrypted] = ciphertext.split(":");

  if (!ivHex || !encrypted) {
    throw new Error("Invalid ciphertext format");
  }

  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    ENCRYPTION_KEY,
    iv
  );

  let decrypted = decipher.update(encrypted, "hex", "utf-8");
  decrypted += decipher.final("utf-8");

  return decrypted;
};