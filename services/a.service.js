import * as aDao from '../dao/a.dao.js';

export const getAData = async () => {
    // Business logic could go here
    return await aDao.fetchA();
};

export const getBData = async () => {
    // Business logic could go here
    return await aDao.fetchB();
};
