/**
 * @file Entry point for starting the Express application server.
 */
import app from "./index"

const PORT = process.env.PORT || 3001;

/**
 * Starts the HTTP server and logs the listening port.
 */
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
