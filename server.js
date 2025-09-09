
const express = require('express');
const path = require('path');
const fs = require('fs');
const loginRouter = require('./routes/login.routes');
var { logger, requestLogger } = require('./middleware/logger');

let settings = { logToFile: false };
try {
    settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'settings.json'), 'utf8'));
} catch (e) {
}


const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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

module.exports.settings = settings;