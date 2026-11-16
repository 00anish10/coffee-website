import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

export const UPLOAD_DIR = path.resolve(process.cwd(), 'server', 'uploads');
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const MIME_EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
};

const DATA_URL_PATTERN =
  /^data:(image\/(?:jpeg|png|webp|gif|avif));base64,([A-Za-z0-9+/=\s]+)$/;

function hasValidSignature(buffer: Buffer, mime: string): boolean {
  switch (mime) {
    case 'image/jpeg':
      return buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    case 'image/png':
      return buffer.length > 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    case 'image/gif':
      return buffer.length > 6 && buffer.subarray(0, 4).toString('ascii') === 'GIF8';
    case 'image/webp':
      return (
        buffer.length > 12 &&
        buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
        buffer.subarray(8, 12).toString('ascii') === 'WEBP'
      );
    case 'image/avif':
      return buffer.length > 12 && buffer.subarray(4, 12).toString('ascii').includes('ftypavif');
    default:
      return false;
  }
}

export function createUploadError(message: string): Error & { statusCode: number } {
  const err = new Error(message) as Error & { statusCode: number };
  err.statusCode = 400;
  return err;
}

export async function saveGalleryImage(dataUrl: string): Promise<string> {
  const match = DATA_URL_PATTERN.exec(dataUrl.trim());
  if (!match) {
    throw createUploadError('Unsupported image. Use a JPG, PNG, WebP, GIF or AVIF file.');
  }

  const [, mime, base64] = match;
  const buffer = Buffer.from(base64, 'base64');

  if (buffer.length === 0) {
    throw createUploadError('The uploaded image is empty.');
  }
  if (buffer.length > MAX_IMAGE_BYTES) {
    throw createUploadError('Image is too large. Please keep it under 5 MB.');
  }
  if (!hasValidSignature(buffer, mime)) {
    throw createUploadError('The file does not look like a valid image.');
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${Date.now()}-${crypto.randomUUID()}${MIME_EXTENSIONS[mime]}`;
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer, { flag: 'wx' });

  return `/uploads/${filename}`;
}

export async function deleteUploadedImage(imageUrl: string): Promise<void> {
  if (!imageUrl.startsWith('/uploads/')) return;
  const filename = path.basename(imageUrl);
  if (!filename) return;
  try {
    await fs.unlink(path.join(UPLOAD_DIR, filename));
  } catch {
    // The stored file may already be gone; gallery removal should still succeed.
  }
}
