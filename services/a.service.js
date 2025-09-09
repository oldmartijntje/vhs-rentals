const aDao = require('../dao/a.dao');

exports.getAData = async () => {
    // Business logic could go here
    return await aDao.fetchA();
};

exports.getBData = async () => {
    // Business logic could go here
    return await aDao.fetchB();
};
