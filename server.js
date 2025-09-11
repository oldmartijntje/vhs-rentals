import express from 'express';
import path from 'path';
import fs from 'fs';
import { engine } from 'express-handlebars';
import loginRouter from './routes/login.routes.js';
import { logger, requestLogger } from './middleware/logger.js';
import { viewRouter } from './routes/view.routes.js'
import filmRouter from './routes/film.routes.js';
import { hbsHelpers } from './helper/handlebars.helper.js';

let settings = { logToFile: false };
try {
    settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'settings.json'), 'utf8'));
} catch (e) { }

const app = express();
const PORT = process.env.PORT || 3000;

app.engine('handlebars', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(process.cwd(), 'views/layouts'),
    partialsDir: path.join(process.cwd(), 'views/partials'),
    helpers: hbsHelpers
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(process.cwd(), 'views'));

// Middleware
app.use(requestLogger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/static', express.static(path.join(process.cwd(), 'public')));

// include .routes.js
app.use('/api/login', loginRouter);
app.use('/api/film', filmRouter);
app.use('/', viewRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

app.listen(PORT, () => {
    logger.debug(`Server running on http://localhost:${PORT}`);
});

export { settings };