/**
 * Controller for rendering View A
 * @param {*} req 
 * @param {*} res 
 */
aService.getAData((err, data) => {
    if (err) {
        return res.status(500).send('Error loading View A');
    }
    res.render('a', { data });
});


/**
 * Controller for rendering View B
 * @param {*} req 
 * @param {*} res 
 */
aService.getBData((err, data) => {
    if (err) {
        return res.status(500).send('Error loading View B');
    }
    res.render('b', { data });
});