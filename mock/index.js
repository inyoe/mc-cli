const DATA_PATH = __dirname + '/module/';
const fs = require('fs');

const mergeData = () => {
    const files = fs.readdirSync(DATA_PATH).filter((item) => {
        return item.endsWith('.js');
    });

    let totalData = {};

    for (let item of files) {
        delete require.cache[require.resolve(DATA_PATH + item)];
        const data = require(DATA_PATH + item);
        totalData = Object.assign({}, totalData, data);
    }

    return totalData;
}



module.exports = mergeData