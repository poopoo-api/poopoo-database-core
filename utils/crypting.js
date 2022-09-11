import {
  createHash,
  randomBytes,
  createCipheriv,
  createDecipheriv,
} from "node:crypto";

/**
 * @param {String} text
 */
function hash(text) {
  return createHash("sha256").update(text).digest("hex");
}

/**
 * @param {String} text
 * @param {String} secretKey
 * @returns {{iv: String, content: String, secretKey: String}}
 */
function encrypt(text, secretKey) {
  const algorithm = "aes-256-ctr";
  const iv = randomBytes(16);

  const cipher = createCipheriv(algorithm, secretKey, iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
    secretKey,
  };
} // check index line 128 also i gtg bye okay byeeeeeeeeeeeeeeeee

/**
 *
 * @param {String} encryptedText
 */
function decrypt(encryptedText, secretKey) {
  const algorithm = "aes-256-ctr";
  const decipher = createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(encryptedText.iv, "hex")
  );

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedText.content, "hex")),
    decipher.final(),
  ]);

  return { content: decrypted.toString(), secretKey };
}

export { hash, encrypt, decrypt };
