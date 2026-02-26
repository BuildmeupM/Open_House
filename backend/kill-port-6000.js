const { execSync } = require('child_process');

try {
  // Find PID on port 6000
  const output = execSync('netstat -ano | findstr :6000').toString();
  const lines = output.split('\n').filter(line => line.includes('LISTENING'));
  
  if (lines.length > 0) {
    const parts = lines[0].trim().split(/\s+/);
    const pid = parts[parts.length - 1];
    console.log(`Found process ${pid} listening on port 6000. Killing it...`);
    
    // Kill the process
    execSync(`taskkill /F /PID ${pid}`);
    console.log(`Process ${pid} killed successfully.`);
  } else {
    console.log('No process found listening on port 6000.');
  }
} catch (error) {
  console.log('Error or no process found:', error.message);
}
