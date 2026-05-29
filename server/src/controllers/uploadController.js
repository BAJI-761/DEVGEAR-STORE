import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import Product from '../models/Product.js';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../../uploads');

function buildLocalImageUrl(req, filename) {
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
}

function getFileExtension(file) {
  const extension = path.extname(file.originalname || '').toLowerCase();
  if (extension) {
    return extension;
  }

  const mimeExtensions = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg'
  };

  return mimeExtensions[file.mimetype] || '.bin';
}

export async function uploadProductImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'FILE_REQUIRED',
          message: 'Please provide an image file'
        }
      });
    }

    if (isCloudinaryConfigured()) {
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: 'devgear-store/products'
      });

      res.status(201).json({
        success: true,
        data: {
          image: {
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            storage: 'cloudinary'
          }
        }
      });
      return;
    }

    await mkdir(uploadsDir, { recursive: true });
    const fileExtension = getFileExtension(req.file);
    const filename = `${randomUUID()}${fileExtension}`;
    const filePath = path.join(uploadsDir, filename);

    await writeFile(filePath, req.file.buffer);

    // create resized variants (jpg + webp)
    const sizes = [400, 800, 1200];
    const baseName = path.parse(filename).name;
    const variants = {};

    for (const w of sizes) {
      const outJpg = `${baseName}-${w}.jpg`;
      const outWebp = `${baseName}-${w}.webp`;
      const outJpgPath = path.join(uploadsDir, outJpg);
      const outWebpPath = path.join(uploadsDir, outWebp);

      // use sharp to resize and write
      await sharp(req.file.buffer).resize({ width: w }).jpeg({ quality: 80 }).toFile(outJpgPath);
      await sharp(req.file.buffer).resize({ width: w }).webp({ quality: 75 }).toFile(outWebpPath);

      variants[w] = {
        jpg: buildLocalImageUrl(req, outJpg),
        webp: buildLocalImageUrl(req, outWebp)
      };
    }

    const imageResponse = {
      url: buildLocalImageUrl(req, filename),
      publicId: null,
      width: null,
      height: null,
      storage: 'local',
      variants
    };

    // if this upload is tied to a product, persist the image into the product's images array
    if (req.body && req.body.productId) {
      try {
        const prod = await Product.findById(req.body.productId);
        if (prod) {
          prod.images = prod.images || [];
          prod.images.push({ url: imageResponse.url, alt: req.body.alt || '', variants: imageResponse.variants });
          await prod.save();
        }
      } catch (err) {
        // non-fatal: log and continue
        console.warn('Failed to attach uploaded image to product', err.message || err);
      }
    }

    res.status(201).json({ success: true, data: { image: imageResponse }, message: 'Image uploaded and variants generated' });
  } catch (error) {
    next(error);
  }
}