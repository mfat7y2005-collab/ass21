import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { DeleteObjectCommand, DeleteObjectCommandOutput } from "@aws-sdk/client-s3";
import { awsConfig } from "../config/aws";
import { Upload } from "@aws-sdk/lib-storage";
import { randomUUID } from "crypto";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class S3Service {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: awsConfig.region,
      credentials: {
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey,
      },
    });
  }


async uploadAsset({
  Bucket,
  file,
  path = "general",
  fileName,
  ContentType,
  ACL = "public-read",
}: {
  Bucket?: string;
  file: Buffer;
  path?: string;
  fileName?: string;
  ContentType?: string;
  ACL?: "private" | "public-read";
}) {
  const Key = `${path}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket,
    Key,
    Body: file,
    ContentType,
    ACL,
  });

  await this.client.send(command);

  return {
    Key,
    url: `https://${Bucket}.s3.${awsConfig.region}.amazonaws.com/${Key}`,
  };
}

  //  LARGE FILES 
  async uploadLargeAsset({
    Bucket,
    file,
    path = "general",
    fileName,
    ContentType,
    ACL = "public-read",
  }: {
    Bucket: string;
    file: Buffer;
    path?: string;
    fileName: string;
    ContentType: string;
    ACL?: "private" | "public-read";
  }) {
    const Key = `${path}/${fileName}`;

    const uploadFile = new Upload({
      client: this.client,
      params: {
        Bucket,
        Key,
        Body: file,
        ContentType,
        ACL,
      },
    });

    uploadFile.on("httpUploadProgress", (progress) => {
      if (!progress.total) return;

      const percent = (progress.loaded! / progress.total) * 100;
      console.log(`Upload: ${percent.toFixed(2)}%`);
    });

    await uploadFile.done();

    return {
      Key,
      url: `https://${Bucket}.s3.${awsConfig.region}.amazonaws.com/${Key}`,
    };
  }

  
  async uploadAssets({
    Bucket,
    files,
    path = "general",
    ContentType,
    ACL = "public-read",
  }: {
    Bucket: string;
    files: Buffer[];
    path?: string;
    ContentType: string;
    ACL?: "private" | "public-read";
  }) {
    const results = await Promise.all(
      files.map((file) => {
        return this.uploadAsset({
          Bucket,
          file,
          ContentType,
          ACL,
          path,
          fileName: randomUUID(),
        });
      })
    );

    return results;
  }





async createPresignedUploadLink({
  Bucket,
  path = "general",
  fileName,
  ContentType,
  expiresIn = 60, 
}: {
  Bucket: string;
  path?: string;
  fileName: string;
  ContentType: string;
  expiresIn?: number;
}) {
  const Key = `${path}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket,
    Key,
    ContentType,
  });

  const url = await getSignedUrl(this.client, command, {
    expiresIn,
  });

  return {
    Key,
    url,
  };
}


//  create_Fetch_Presigned_Link  
async createPresignedFetchLink({
  Bucket,
  path = "general",
  fileName,
  Key: inputKey,
  expiresIn = 60,
}: {
  Bucket?: string;
  Key?: string;
  path?: string;
  fileName?: string;
  expiresIn?: number;
}) {
  const Key = inputKey ?? `${path}/${fileName}`;

  const command = new GetObjectCommand({
    Bucket,
    Key,
  });

  const url = await getSignedUrl(this.client, command, {
    expiresIn,
  });

  return {
    Key,
    url,
  };
}




async deleteAsset({
  Bucket = awsConfig.bucketName as string,
  Key,
}: {
  Bucket?: string;
  Key: string;
}): Promise<DeleteObjectCommandOutput> {
  if (!Bucket) {
    throw new Error("Bucket is required");
  }

  const command = new DeleteObjectCommand({
    Bucket,
    Key,
  });

  return this.client.send(command);
}






async getAsset({
  Bucket,
  Key,
}: {
  Bucket?: string;
  Key: string;
}): Promise<{
  Body: NodeJS.ReadableStream;
  ContentType: string | undefined;
}> {
  const command = new GetObjectCommand({
    Bucket,
    Key,
  });

  const response = await this.client.send(command);

  return {
    Body: response.Body as NodeJS.ReadableStream,
    ContentType: response.ContentType,
  };
}



// async getAsset({
//   Bucket,
//   Key,
// }: {
//   Bucket?: string;
//   Key: string;
// }): Promise<string> {
//   const command = new GetObjectCommand({
//     Bucket,
//     Key,
//   });

//   const response = await this.client.send(command);

//   if (!response.Body) {
//     throw new Error("Empty body");
//   }

//   const stream = response.Body as NodeJS.ReadableStream;

  
//   const chunks: Buffer[] = [];

//   for await (const chunk of stream) {
//     chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
//   }

//   const buffer = Buffer.concat(chunks);

//   return buffer.toString("utf-8");
// }


}

export const s3Service = new S3Service();