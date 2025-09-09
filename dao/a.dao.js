const pool = require('../database/pool');

exports.fetchA = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT title FROM film LIMIT 1', (err, results) => {
            if (err) return reject(err);
            resolve(results[0] ? results[0].title : 'No film data');
        });
    });
};

exports.fetchB = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT CONCAT(first_name, ' ', last_name) AS name FROM actor LIMIT 1", (err, results) => {
            if (err) return reject(err);
            resolve(results[0] ? results[0].name : 'No actor data');
        });
    });
};
