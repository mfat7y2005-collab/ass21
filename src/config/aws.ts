export const awsConfig = {
  region: process.env.AWS_REGION as string,
  bucketName: process.env.AWS_BUCKET_NAME as string,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  expiresIn: Number(process.env.AWS_EXPIRES_IN) || 120,
};

