import * as aDao from '../dao/a.dao.js';

/**
 * Service to get A data
 * @param {function} callback (err, data) => void
 */
aDao.fetchA((err, data) => {
    if (err) return callback(err);
    callback(null, data);
});


/**
 * Service to get B data
 * @param {function} callback (err, data) => void
 */
aDao.fetchB((err, data) => {
    if (err) return callback(err);
    callback(null, data);
});

