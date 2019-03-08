process.argv.forEach((item) => {
    if (item === 'dev') {
        global.commandName = 'dev';
    } else {
        const result = item.match(/-env=(.*)/);
        if (result) {
            global.env = result[1];
        }
    }
})

const requireDir = require('require-dir');
requireDir('./gulp/module/');
requireDir('./gulp/');