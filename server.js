const express = require('express');
const path = require('path');
const aRouter = require('./routes/a.router');
var { logger, requestLogger } = require('./middleware/logger');

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
app.use('/', aRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

app.listen(PORT, () => {
    logger.debug(`Server running on http://localhost:${PORT}`);
});
