#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting RPG Bank Application...\n');

// Check if we're on Windows
const isWindows = process.platform === 'win32';

// Function to run a command
function runCommand(command, description, cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    console.log(`Starting ${description}...`);
    
    const args = isWindows ? ['cmd', '/c', command] : ['sh', '-c', command];
    const child = spawn(args[0], args.slice(1), { 
      cwd, 
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: isWindows 
    });

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
      process.stdout.write(data);
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
      process.stderr.write(data);
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`\n${description} started successfully!`);
        resolve(output);
      } else {
        console.error(`\n${description} failed with exit code ${code}`);
        reject(new Error(`${description} failed: ${errorOutput}`));
      }
    });

    child.on('error', (error) => {
      console.error(`\nError starting ${description}:`, error.message);
      reject(error);
    });
  });
}

// Function to check if a file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

// Main execution function
async function main() {
  try {
    const projectRoot = process.cwd();
    
    // Check if we're in the right directory
    if (!fileExists(path.join(projectRoot, 'backend')) || !fileExists(path.join(projectRoot, 'frontend'))) {
      console.error('Error: Please run this command from the project root directory.');
      console.log('The directory should contain both "backend" and "frontend" folders.');
      process.exit(1);
    }

    // Get command line arguments
    const args = process.argv.slice(2);
    const command = args[0] || 'all';

    console.log(`Command: ${command}`);
    console.log('='.repeat(50));

    switch (command) {
      case 'all':
        await startAll();
        break;
      case 'backend':
        await startBackend();
        break;
      case 'frontend':
        await startFrontend();
        break;
      case 'build':
        await buildAll();
        break;
      case 'test':
        await testAll();
        break;
      case 'docker':
        await startDocker();
        break;
      default:
        console.log('Usage: node start.js [command]');
        console.log('Commands:');
        console.log('  all       - Start both backend and frontend (default)');
        console.log('  backend   - Start only backend');
        console.log('  frontend  - Start only frontend');
        console.log('  build     - Build both backend and frontend');
        console.log('  test      - Run all tests');
        console.log('  docker    - Start with Docker');
        break;
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

async function startAll() {
  console.log('Starting both backend and frontend...\n');
  
  // Start backend first
  await runCommand('start-backend.bat', 'Backend');
  
  // Wait a moment for backend to start
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Start frontend
  await runCommand('start-frontend.bat', 'Frontend');
  
  console.log('\n='.repeat(50));
  console.log('Both servers are starting...');
  console.log('Backend: http://localhost:8080');
  console.log('Frontend: http://localhost:5173');
  console.log('H2 Console: http://localhost:8080/h2-console');
  console.log('\nPress Ctrl+C to stop all servers');
}

async function startBackend() {
  await runCommand('start-backend.bat', 'Backend');
  console.log('\nBackend server is running at: http://localhost:8080');
}

async function startFrontend() {
  await runCommand('start-frontend.bat', 'Frontend');
  console.log('\nFrontend server is running at: http://localhost:5173');
}

async function buildAll() {
  console.log('Building both backend and frontend...\n');
  
  await runCommand('cd backend && ./gradlew build', 'Backend Build');
  await runCommand('cd frontend && npm run build', 'Frontend Build');
  
  console.log('\nBuild completed successfully!');
}

async function testAll() {
  console.log('Running all tests...\n');
  
  await runCommand('cd backend && ./gradlew test', 'Backend Tests');
  await runCommand('cd frontend && npm test', 'Frontend Tests');
  
  console.log('\nAll tests completed!');
}

async function startDocker() {
  console.log('Starting with Docker...\n');
  
  await runCommand('docker-compose up -d', 'Docker Services');
  
  console.log('\nDocker services are starting...');
  console.log('Backend: http://localhost:8080');
  console.log('Frontend: http://localhost:80');
  console.log('Database: PostgreSQL on port 5432');
  console.log('Redis: Redis on port 6379');
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\nStopping servers...');
  process.exit(0);
});

// Run the main function
main();
