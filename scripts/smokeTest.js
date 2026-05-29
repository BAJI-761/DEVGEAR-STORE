import axios from 'axios';

const API = process.env.API_URL || 'http://localhost:5000/api/v1';

async function run() {
  console.log('Running smoke tests against', API);
  try {
    const health = await axios.get(`${API}/health`);
    console.log('Health:', health.data.success ? 'OK' : 'FAIL');

    const products = await axios.get(`${API}/products?limit=3`);
    console.log('Products:', Array.isArray(products.data.data.items) ? `${products.data.data.items.length} items` : 'unexpected');

    console.log('Smoke tests passed');
    process.exit(0);
  } catch (err) {
    console.error('Smoke test failed:', err.message || err);
    process.exit(2);
  }
}

run();
