const aService = require('../services/a.service');

exports.getA = async (req, res) => {
    try {
        const data = await aService.getAData();
        res.render('a', { data });
    } catch (err) {
        res.status(500).send('Error loading View A');
    }
};

exports.getB = async (req, res) => {
    try {
        const data = await aService.getBData();
        res.render('b', { data });
    } catch (err) {
        res.status(500).send('Error loading View B');
    }
};
