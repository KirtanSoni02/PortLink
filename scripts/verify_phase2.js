import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendPath = path.join(__dirname, '../backend');
const packageJsonPath = path.join(backendPath, 'package.json');

console.log("Starting Phase 2 Verification...");

// 1. Check node-cron dependency
console.log("\n1. Checking node-cron dependency...");
try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (packageJson.dependencies && packageJson.dependencies['node-cron']) {
        console.log("✅ PASS: 'node-cron' dependency found.");
    } else {
        console.error("❌ FAIL: 'node-cron' dependency missing.");
    }
} catch (err) {
    console.error("❌ FAIL: Could not read package.json:", err.message);
}

// 2. Check Otp model
console.log("\n2. Checking Otp.model.js...");
const otpModelPath = path.join(backendPath, 'models/Otp.model.js');
if (fs.existsSync(otpModelPath)) {
    console.log("✅ PASS: Otp.model.js exists.");
    const content = fs.readFileSync(otpModelPath, 'utf8');
    if (content.includes('expires: 600')) {
        console.log("✅ PASS: TTL index found in Otp model.");
    } else {
        console.error("❌ FAIL: TTL index missing in Otp model.");
    }
} else {
    console.error("❌ FAIL: Otp.model.js missing.");
}

// 3. Check server.js for cron and CORS
console.log("\n3. Checking server.js...");
const serverJsPath = path.join(backendPath, 'server.js');
try {
    const serverJs = fs.readFileSync(serverJsPath, 'utf8');
    if (serverJs.includes('startShipArchiver()')) {
        console.log("✅ PASS: Cron job initialized.");
    } else {
        console.error("❌ FAIL: Cron job initialization missing.");
    }
    if (serverJs.includes('process.env.ALLOWED_ORIGINS')) {
        console.log("✅ PASS: Dynamic CORS configuration found.");
    } else {
        console.error("❌ FAIL: Dynamic CORS configuration missing.");
    }
} catch (err) {
    console.error("❌ FAIL: Could not read server.js:", err.message);
}

// 4. Check shiproutes.js for security
console.log("\n4. Checking shiproutes.js...");
const shipRoutesPath = path.join(backendPath, 'routes/shiproutes.js');
try {
    const content = fs.readFileSync(shipRoutesPath, 'utf8');
    if (content.includes('router.get("/realtimetracking", verifyToken')) {
        console.log("✅ PASS: realtimetracking endpoint secured.");
    } else {
        console.error("❌ FAIL: realtimetracking endpoint NOT secured.");
    }
} catch (err) {
    console.error("❌ FAIL: Could not read shiproutes.js:", err.message);
}

// 5. Check sailorroutes.js for race condition fix
console.log("\n5. Checking sailorroutes.js...");
const sailorRoutesPath = path.join(backendPath, 'routes/sailorroutes.js');
try {
    const content = fs.readFileSync(sailorRoutesPath, 'utf8');
    if (content.includes('findOneAndUpdate') && content.includes('$expr')) {
        console.log("✅ PASS: Atomic update (findOneAndUpdate) found.");
    } else {
        console.error("❌ FAIL: Atomic update missing or incorrect.");
    }
} catch (err) {
    console.error("❌ FAIL: Could not read sailorroutes.js:", err.message);
}

console.log("\nVerification complete.");
