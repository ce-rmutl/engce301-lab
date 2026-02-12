/**
 * Middleware จัดการ errors ทั้งหมด
 */
function errorHandler(err, req, res, next) {
    console.error('❌ เกิดข้อผิดพลาด:', err);

    // Default error
    let statusCode = 500;
    let message = 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์';

    // Database errors
    if (err.message && err.message.includes('SQLITE')) {
        statusCode = 500;
        message = 'เกิดข้อผิดพลาดในฐานข้อมูล';
    }

    // Validation errors
    if (err.message && err.message.includes('ข้อมูลไม่ถูกต้อง')) {
        statusCode = 400;
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}

module.exports = errorHandler;