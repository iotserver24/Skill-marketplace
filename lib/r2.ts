import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize R2 client (S3-compatible)
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;

export interface UploadResult {
  key: string;
  url: string;
}

/**
 * Upload a file to R2 storage
 */
export async function uploadToR2(
  key: string,
  content: string,
  contentType: string = 'text/markdown'
): Promise<UploadResult> {
  console.log('[DEBUG] R2 Upload Attempt:', {
    bucket: BUCKET_NAME,
    key,
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
  });

  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: content,
      ContentType: contentType,
    });

    await r2Client.send(command);

    const url = `${process.env.R2_PUBLIC_URL}/${key}`;
    console.log('[DEBUG] R2 Upload Success:', url);

    return { key, url };
  } catch (err: any) {
    console.error('[DEBUG] R2 Upload Error Detail:', {
      message: err.message,
      name: err.name,
      requestId: err.$metadata?.requestId,
      cfId: err.$metadata?.cfId,
      code: err.Code || err.code
    });
    throw err;
  }
}

/**
 * Get file content from R2
 */
export async function getFromR2(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const response = await r2Client.send(command);
  const content = await response.Body?.transformToString();

  if (!content) {
    throw new Error('File not found or empty');
  }

  return content;
}

/**
 * Delete file from R2
 */
export async function deleteFromR2(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await r2Client.send(command);
}

/**
 * Generate a signed URL for temporary access
 */
export async function getSignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(r2Client, command, { expiresIn });
}
