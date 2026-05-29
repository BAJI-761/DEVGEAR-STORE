import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { randomUUID } from 'crypto';
import { mkdir, rm, readdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

dotenv.config({ path: path.resolve(process.cwd(), './.env') });

const uploadsDir = path.resolve(process.cwd(), './server/uploads');

const IMAGE_SOURCES = {
  Keyboards: [
    'https://images.unsplash.com/photo-1595225476474-87563907a212?w=1200&q=80',
    'https://images.unsplash.com/photo-1555532538-dcdbd01d3738?w=1200&q=80',
    'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=1200&q=80',
    'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=1200&q=80',
    'https://images.unsplash.com/photo-1605436247078-f0ef43ee8d5c?w=1200&q=80'
  ],
  Monitors: [
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&q=80',
    'https://images.unsplash.com/photo-1542732816-72eb1a0673ed?w=1200&q=80',
    'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=1200&q=80',
    'https://images.unsplash.com/photo-1552831388-6a0b35077328?w=1200&q=80',
    'https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=1200&q=80'
  ],
  Audio: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&q=80',
    'https://images.unsplash.com/photo-1520170350707-b2da59970118?w=1200&q=80',
    'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=1200&q=80'
  ],
  Laptops: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1200&q=80',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1200&q=80'
  ],
  Accessories: [
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c392c?w=1200&q=80',
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1200&q=80',
    'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=1200&q=80',
    'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=1200&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=1200&q=80'
  ],
  Storage: [
    'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=1200&q=80',
    'https://images.unsplash.com/photo-1544654803-b69140b285a1?w=1200&q=80',
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=1200&q=80',
    'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=1200&q=80',
    'https://images.unsplash.com/photo-1563604179373-cfdf6903f7e5?w=1200&q=80'
  ]
};

const BRANDS = ['DevGear', 'TechForge', 'Nimbus', 'Nova', 'CyberPro', 'Apex'];
const MODIFIERS = ['Pro', 'Ultra', 'Elite', 'V2', 'Wireless', 'Mini', 'Max', 'Plus'];

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function cleanUploadsDir() {
  try {
    const files = await readdir(uploadsDir);
    for (const file of files) {
      if (file !== '.gitkeep') {
        await rm(path.join(uploadsDir, file), { recursive: true, force: true });
      }
    }
    console.log('Cleaned uploads directory');
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
  await mkdir(uploadsDir, { recursive: true });
}

const imageCache = new Map();

async function downloadImage(url) {
  if (imageCache.has(url)) {
    return imageCache.get(url);
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  imageCache.set(url, buffer);
  return buffer;
}

async function generateImageFiles(category, name) {
  const sources = IMAGE_SOURCES[category] || IMAGE_SOURCES['Accessories'];
  const sourceUrl = sources[Math.floor(Math.random() * sources.length)];
  
  const id = randomUUID();
  const imageBuffer = await downloadImage(sourceUrl);

  const sizes = [400, 800, 1200];
  const variants = {};

  for (const w of sizes) {
    const outJpg = `${id}-${w}.jpg`;
    const outWebp = `${id}-${w}.webp`;
    const outJpgPath = path.join(uploadsDir, outJpg);
    const outWebpPath = path.join(uploadsDir, outWebp);

    await sharp(imageBuffer).resize({ width: w }).jpeg({ quality: 80 }).toFile(outJpgPath);
    await sharp(imageBuffer).resize({ width: w }).webp({ quality: 75 }).toFile(outWebpPath);

    variants[w] = {
      jpg: `http://localhost:5000/uploads/${outJpg}`,
      webp: `http://localhost:5000/uploads/${outWebp}`
    };
  }

  const mainUrl = `http://localhost:5000/uploads/${id}-1200.jpg`;
  return { url: mainUrl, alt: `${name}`, variants };
}

function generateProductName(category) {
  const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
  const modifier = Math.random() > 0.5 ? MODIFIERS[Math.floor(Math.random() * MODIFIERS.length)] : '';
  
  let baseName = '';
  switch (category) {
    case 'Keyboards': baseName = 'Mechanical Keyboard'; break;
    case 'Monitors': baseName = 'Ultrawide Display'; break;
    case 'Audio': baseName = 'Noise-Cancelling Headphones'; break;
    case 'Laptops': baseName = 'Creator Laptop'; break;
    case 'Accessories': baseName = 'Precision Mouse'; break;
    case 'Storage': baseName = 'NVMe SSD 2TB'; break;
  }
  
  return `${brand} ${modifier ? modifier + ' ' : ''}${baseName}`.trim();
}

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI not set in server/.env');
    process.exit(1);
  }

  await cleanUploadsDir();

  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB || undefined });

  await Product.deleteMany({});
  console.log('Cleared existing products');

  const categories = ['Keyboards', 'Monitors', 'Audio', 'Accessories', 'Storage', 'Laptops'];
  const created = [];

  for (let i = 1; i <= 50; i++) {
    const category = categories[i % categories.length];
    const name = generateProductName(category);
    const slug = `${slugify(name)}-${Math.random().toString(36).slice(2, 6)}`;
    const sku = `DG-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const price = Math.floor(49 + Math.random() * 499) * 100 + 99;
    const stock = Math.floor(5 + Math.random() * 95);
    
    console.log(`[${i}/50] Generating: ${name}`);
    
    let image;
    try {
      image = await generateImageFiles(category, name);
    } catch (err) {
      console.error(`Failed to generate image for ${name}`, err);
      continue;
    }

    const product = {
      name,
      slug,
      sku,
      description: `Engineered for performance and reliability, the ${name} delivers exceptional results for professionals and enthusiasts alike. Features premium build quality and cutting-edge technology.`,
      category,
      brand: name.split(' ')[0],
      price,
      compareAtPrice: Math.random() > 0.5 ? Math.floor(price * 1.2) : null,
      stock,
      images: [image],
      tags: ['premium', category.toLowerCase(), 'new'],
      specs: { warranty: '1 year', condition: 'New', color: 'Matte Black' }
    };

    try {
      const doc = await Product.create(product);
      created.push(doc);
    } catch (err) {
      console.error('Failed to create product', err.message || err);
    }
  }

  console.log(`Created ${created.length} highly realistic products`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
