import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env.local') });
console.log("ID:", process.env.RAZORPAY_KEY_ID);
console.log("Secret:", process.env.RAZORPAY_KEY_SECRET);
