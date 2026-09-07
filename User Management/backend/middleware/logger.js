// ============================================
// LOGGER - Working MySQL Version
// ============================================

const fs = require('fs');
const path = require('path');

const logDirectory = path.join(__dirname, '../logs');

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

// ============================================
// Send log to MySQL via XAMPP
// ============================================

const sendToMySQL = async (level, message, data = null, user_id = null) => {
    try {
        const response = await fetch('http://localhost/log_handler.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ level, message, data, user_id })
        });
        
        if (!response.ok) {
            console.log('⚠️ MySQL log server returned:', response.status);
            return null;
        }
        
        const result = await response.json();
        console.log(`📝 Log sent to MySQL: ${level} - ${message}`);
        return result;
    } catch (error) {
        console.log('⚠️ MySQL log server not available:', error.message);
        return null;
    }
};

// ============================================
// Write to local file (fallback)
// ============================================

const writeLog = async (level, message, data = null, user_id = null) => {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, message, data, user_id };

    // Console log
    console.log(`[${timestamp}] ${level}: ${message}`);

    // Save to file
    const fileName = `${new Date().toISOString().split('T')[0]}.log`;
    const logFilePath = path.join(logDirectory, fileName);
    fs.appendFileSync(logFilePath, JSON.stringify(logEntry) + '\n');

    // Send to MySQL
    await sendToMySQL(level, message, data, user_id);
};

// ============================================
// Logger Middleware
// ============================================

const logger = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', async () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent'),
            user: req.user ? req.user._id : 'Guest'
        };
        
        const level = res.statusCode >= 400 ? 'ERROR' : 'INFO';
        const message = res.statusCode >= 400 
            ? `Request failed: ${req.method} ${req.url}` 
            : `Request: ${req.method} ${req.url}`;
        
        // Log the request
        await writeLog(level, message, logData, req.user?._id);
    });
    
    next();
};

// ============================================
// Also log important events manually
// ============================================

const logEvent = async (level, message, data = null, user_id = null) => {
    await writeLog(level, message, data, user_id);
};

module.exports = { logger, writeLog, logEvent };