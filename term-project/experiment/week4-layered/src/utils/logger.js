/**
 * Logger utility
 */
class Logger {
    info(message, ...args) {
        console.log(`ℹ️  [INFO] ${message}`, ...args);
    }

    error(message, ...args) {
        console.error(`❌ [ERROR] ${message}`, ...args);
    }

    warn(message, ...args) {
        console.warn(`⚠️  [WARN] ${message}`, ...args);
    }

    debug(message, ...args) {
        if (process.env.LOG_LEVEL === 'debug') {
            console.log(`🐛 [DEBUG] ${message}`, ...args);
        }
    }
}

module.exports = new Logger();