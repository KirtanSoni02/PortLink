import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendPath = path.join(__dirname, '../backend');
const packageJsonPath = path.join(backendPath, 'package.json');

console.log("Starting verification...");

// 1. Verify 'expres' is removed from package.json
console.log("\n1. Checking package.json for invalid dependencies...");
try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (packageJson.dependencies && packageJson.dependencies['expres']) {
        console.error("❌ FAIL: 'expres' dependency still present.");
    } else {
        console.log("✅ PASS: 'expres' dependency removed.");
    }
} catch (err) {
    console.error("❌ FAIL: Could not read package.json:", err.message);
}

// 2. Check server.js for sensitive logs and CORS
console.log("\n2. Checking server.js for security fixes...");
const serverJsPath = path.join(backendPath, 'server.js');
try {
    const serverJs = fs.readFileSync(serverJsPath, 'utf8');
    if (serverJs.includes('console.log("📡 Received location update:", data)')) {
        console.error("❌ FAIL: Sensitive location log still present.");
    } else {
        console.log("✅ PASS: Sensitive location log removed.");
    }

    if (serverJs.includes('origin: "*"')) {
        console.error("❌ FAIL: Socket.io CORS origin is still '*'.");
    } else {
        console.log("✅ PASS: Socket.io CORS origin restricted.");
    }
} catch (err) {
    console.error("❌ FAIL: Could not read server.js:", err.message);
}

// 3. Check authcontroller.js for double hashing and secrets
console.log("\n3. Checking authcontroller.js for security fixes...");
const authControllerPath = path.join(backendPath, 'controllers/authcontroller.js');
try {
    const authController = fs.readFileSync(authControllerPath, 'utf8');
    if (authController.includes('console.log("JWT_SECRET:", jwtt)')) {
        console.error("❌ FAIL: JWT_SECRET log still present.");
    } else {
        console.log("✅ PASS: JWT_SECRET log removed.");
    }

    if (authController.includes('hashedPassword = await bcrypt.hash(password, 10)')) {
         // It might be commented out, so we check if it's active
         // A simple check is if it exists and is NOT commented.
         // But since I commented it out, searching for the string might find the comment.
         // Let's check if the *active* code uses it.
         // This is hard with regex, but let's check if the line is present without //
         const lines = authController.split('\n');
         const hashingLine = lines.find(line => line.trim().startsWith('hashedPassword = await bcrypt.hash(password, 10)'));
         if (hashingLine) {
             console.error("❌ FAIL: Manual password hashing still active.");
         } else {
             console.log("✅ PASS: Manual password hashing removed (or commented out).");
         }
    } else {
        console.log("✅ PASS: Manual password hashing code not found.");
    }
} catch (err) {
    console.error("❌ FAIL: Could not read authcontroller.js:", err.message);
}

console.log("\nVerification complete.");
