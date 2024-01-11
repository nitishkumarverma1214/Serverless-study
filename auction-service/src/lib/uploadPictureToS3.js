import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({});

export const uploadPictureToS3 = async (key, body) => {
  const command = new PutObjectCommand({
    Bucket: process.env.AUCTION_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg',
  });

  try {
    const response = await client.send(command);
    console.log(response);
    return response;
  } catch (err) {
    console.error(err);
  }
};
