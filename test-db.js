
const fs = require('fs');
const path = require('path');

// 1. Check if .env exists
const envPath = path.join(__dirname, '.env');
const exists = fs.existsSync(envPath);
console.log(exists ? '✅ .env found.' : '❌ .env NOT found.');

// 2. Try loading variable
let uri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!uri && exists) {
    console.log('⚠️ manually parsing .env...');
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
        const [key, val] = line.split('=');
        if (key && val) {
            const k = key.trim();
            const v = val.trim();
            if (k === 'MONGODB_URI' || k === 'MONGO_URI') uri = v;
        }
    });
}

console.log('Current URI value:', uri ? 'Defined (Hidden)' : 'UNDEFINED');

if (!uri) {
    console.error('❌ Stopping: missing URI.');
    process.exit(1);
}

// SANITIZE URI
// Remove "appName=" if it has no value
if (uri.endsWith('appName=')) {
    uri = uri.slice(0, -8);
    console.log('⚠️ Removed trailing "appName="');
}
if (uri.includes('appName=&')) {
    uri = uri.replace('appName=&', '');
    console.log('⚠️ Removed empty "appName" param');
}

// 3. Connect
const mongoose = require('mongoose');

async function run() {
    try {
        console.log('Connecting...');
        await mongoose.connect(uri);
        console.log('✅ Connected successfully!');

        const TestSchema = new mongoose.Schema({ test: String, date: Date });
        const Test = mongoose.models.TestConnection || mongoose.model('TestConnection', TestSchema);

        await Test.create({ test: 'Hello MongoDB', date: new Date() });
        console.log('✅ Data inserted!');

        await mongoose.connection.close();
        console.log('Done.');
    } catch (error) {
        console.error('❌ Connection failed:', error);
    }
}

run();
