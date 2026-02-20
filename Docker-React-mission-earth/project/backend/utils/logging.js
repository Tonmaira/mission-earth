const fs = require('fs');
const path = require('path');

// Path to log directory
const logDir = path.join(__dirname, '../../frontend/public/log');

// Ensure log directory exists
function ensureLogDirectoryExists() {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
}

// Get log file path for the current date
function getLogFilePath() {
  const currentDate = new Date().toISOString().split('T')[0];
  return path.join(logDir, `log_${currentDate}.log`);
}

// Get log type based on status code
function getLogType(statusCode) {
  if (statusCode >= 200 && statusCode < 300) return "[INFO]";
  if (statusCode >= 400 && statusCode < 500) return "[WARN]";
  if (statusCode >= 500) return "[ERROR]";
  return "[UNKNOWN]";
}

// Write log to file
function writeLog(message) {
  ensureLogDirectoryExists();
  const logFilePath = getLogFilePath();
  fs.appendFile(logFilePath, message + '\n', (err) => {
    if (err) console.error('Error writing log:', err);
  });
}

// Main logger function
function createLog(req, statusCode, remark) {
  const logType = getLogType(statusCode);
  
  // Adjust time to +7 hours
  const now = new Date();
  now.setHours(now.getHours() + 7);
  const formattedDate = now.toISOString();

  let logMessage = `[${formattedDate}] ${logType} ${req.method} ${req.originalUrl} || ${statusCode} - ${remark}`;

  if ((req.method === 'POST' || req.method === 'PUT') && req.body) {
    logMessage += `\nRequest Body: ${JSON.stringify(req.body, null, 2)}`;
  }

  writeLog(logMessage);
}


module.exports = createLog;
