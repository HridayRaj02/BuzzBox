// Final Express middleware: converts known domain/database errors into safe JSON responses.
function createErrorHandler({ BookingError }) {
  return (error, _req, res, _next) => {
    if (error?.code === "P2002") return res.status(409).json({ error: "That email, phone number, or handle is already in use." });
    if (error instanceof BookingError) return res.status(409).json({ error: error.message, code: error.code });
    const status = Number.isInteger(error?.status) ? error.status : 500;
    if (status >= 500) console.error(error);
    return res.status(status).json({ error: status >= 500 ? "An unexpected server error occurred." : error.message });
  };
}

module.exports = { createErrorHandler };
