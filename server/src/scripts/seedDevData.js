import mongoose from 'mongoose';
import { loadEnv } from '../config/env.js';
import { connectDatabase } from '../config/db.js';
import Product from '../models/Product.js';

loadEnv();

const sampleProducts = [
  {
    name: 'Nimbus Mechanical Keyboard',
    slug: 'nimbus-mechanical-keyboard',
    sku: 'KBD-NIMBUS-001',
    description: 'Hot-swappable mechanical keyboard with tactile switches and heavy case feel.',
    category: 'Keyboards',
    subcategory: 'Mechanical',
    brand: 'DevGear',
    price: 8999,
    compareAtPrice: 10999,
    stock: 12,
    images: [{ url: 'https://placehold.co/800x600/png', alt: 'Nimbus Mechanical Keyboard' }],
    tags: ['keyboard', 'mechanical', 'hot-swap'],
    specs: { switchType: 'Tactile', layout: '75%' },
    isFeatured: true
  },
  {
    name: 'Atlas UltraWide Monitor',
    slug: 'atlas-ultrawide-monitor',
    sku: 'MON-ATLAS-001',
    description: 'Wide productivity monitor for coding, design, and multitasking.',
    category: 'Monitors',
    subcategory: 'Ultrawide',
    brand: 'DevGear',
    price: 28999,
    compareAtPrice: 32999,
    stock: 7,
    images: [{ url: 'https://placehold.co/800x600/png', alt: 'Atlas UltraWide Monitor' }],
    tags: ['monitor', 'ultrawide', 'productivity'],
    specs: { resolution: '3440x1440', refreshRate: '144Hz' },
    isFeatured: true
  },
  {
    name: 'Pulse Noise-Cancel Headphones',
    slug: 'pulse-noise-cancel-headphones',
    sku: 'AUD-PULSE-001',
    description: 'All-day headphones built for focus, calls, and long coding sessions.',
    category: 'Audio',
    subcategory: 'Headphones',
    brand: 'DevGear',
    price: 6999,
    compareAtPrice: 7999,
    stock: 20,
    images: [{ url: 'https://placehold.co/800x600/png', alt: 'Pulse Noise-Cancel Headphones' }],
    tags: ['audio', 'headphones', 'noise-canceling'],
    specs: { connectivity: 'Bluetooth 5.3', batteryLife: '30h' },
    isFeatured: false
  }
];

async function seed() {
  await connectDatabase();

  const existingCount = await Product.countDocuments();
  if (existingCount === 0) {
    await Product.insertMany(sampleProducts);
    console.log('Seeded sample products');
  } else {
    console.log('Products already exist, seed skipped');
  }

  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error('Seed failed:', error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});