import * as aService from '../services/a.service.js';

export const getA = async (req, res) => {
    try {
        const data = await aService.getAData();
        res.render('a', { data });
    } catch (err) {
        res.status(500).send('Error loading View A');
    }
};

export const getB = async (req, res) => {
    try {
        const data = await aService.getBData();
        res.render('b', { data });
    } catch (err) {
        res.status(500).send('Error loading View B');
    }
};
