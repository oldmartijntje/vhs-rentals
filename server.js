
import express from 'express';
import path from 'path';
import fs from 'fs';
import loginRouter from './routes/login.routes.js';
import { logger, requestLogger } from './middleware/logger.js';

let settings = { logToFile: false };
try {
    settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'settings.json'), 'utf8'));
} catch (e) { }


const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

// Middleware
app.use(requestLogger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/api/login', loginRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

app.listen(PORT, () => {
    logger.debug(`Server running on http://localhost:${PORT}`);
});

export { settings };