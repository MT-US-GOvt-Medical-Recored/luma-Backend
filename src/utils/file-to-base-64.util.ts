export const fileToBase64 = (file: Express.Multer.File) => {
  return file.buffer.toString("base64");
};
