/**
 * @file Configures the Express application with middleware and API routes.
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

/** Attach security, CORS, and body-parsing middleware. */
app.use(helmet());

// Configure CORS for production and development
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? [process.env.FRONTEND_URL || 'https://incubyte-ai-kata-sweet-shop.vercel.app']
        : [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
        ],
    credentials: true, // Allow cookies and authorization headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Allow-Origin'
    ],
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Global handler for malformed JSON payloads to provide a consistent response.
 */
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
    if (err instanceof SyntaxError && 'body' in err) {
        res.status(400).json({
            error: 'Invalid JSON format',
            message: 'Please check your request body for valid JSON syntax'
        });
        return;
    }
    next(err);
});

/** Health-check root endpoint. */
app.get('/', (req, res) => {
    res.json({ message: 'Sweet Shop API is running!' });
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

/** Mount versioned API routes. */
app.use('/api', routes);

/**
 * Fallback error handler to avoid leaking stack traces.
 */
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

/** Catch-all handler for unmatched routes. */
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});


export default app;
