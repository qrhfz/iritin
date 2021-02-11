var fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

function getBlockList() {
    return readFile('main-blacklist.txt')
}

async function checkBlock (domain) {
    try {
        let list = await getBlockList()
        if (list.includes(domain)) {
            console.log('domain termasuk blocklist')
            return false
        } else {
            console.log('domain boleh')
            return true
        }
    } catch (error) {
        
    }
    
}

exports.checkBlock = checkBlock

