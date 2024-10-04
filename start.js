// start.js
const { exec } = require('child_process');
const path = require('path');

// Define paths for frontend and backend
const frontendPath = path.join(__dirname, 'package');
const backendPath = path.join(__dirname, 'NodejsAPI');

// Log paths for debugging
console.log(`Frontend path: ${frontendPath}`);
console.log(`Backend path: ${backendPath}`);

// Start the backend server
const backend = exec('node server.js', { cwd: backendPath });

// Handle backend server output
backend.stdout.on('data', (data) => {
  console.log(`Backend: ${data}`);
});

backend.stderr.on('data', (data) => {
  console.error(`Backend Error: ${data}`);
});

backend.on('close', (code) => {
  console.log(`Backend process exited with code ${code}`);
});

// Start the frontend server
const frontend = exec('npx next start', { cwd: frontendPath });

// Handle frontend server output
frontend.stdout.on('data', (data) => {
  console.log(`Frontend: ${data}`);
});

frontend.stderr.on('data', (data) => {
  console.error(`Frontend Error: ${data}`);
});

frontend.on('close', (code) => {
  console.log(`Frontend process exited with code ${code}`);
});
