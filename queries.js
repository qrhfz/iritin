const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'nas.local',
    database: 'iritin',
    password: 'panda77i',
    port: 5432,
})

const crypto = require("crypto");
const cB = require('./check_block')
const host =  "http://localhost:3000"


function generateId() {
    const id = crypto.randomBytes(6).toString("base64");
    return id.replace(/\+/g, '-').replace(/\//ig, '_')
}


const createLink = (request, response) => {
    var long_link = request.body.long_link
    if(long_link.startsWith("http://")||long_link.startsWith("https://")){
        console.log('yay')
    }else{
        long_link = 'http://'+long_link
    }
    let domain = (new URL(long_link));
    try {
        if (validURL(long_link)) {
            cB.checkBlock(domain.hostname).then((x) => {
                if (x) {
                    const q = 'INSERT INTO links (id, long_link, ip) VALUES ($1, $2, $3) RETURNING id'
                    var v = [generateId(), long_link, request.connection.remoteAddress]

                    pool.query(q, v, (e, r) => {
                        response.status(200).json({ id: r.rows[0].id })
                    })
                } else {
                    response.status(200).json({ error: "domain di blokir" })
                }
            })
        }
        else {
            response.status(200).json({ error: "bukan link" })
        }
    } catch (error) {

        console.log(error)
    }

}

const resolveLink = (request, response) => {
    try {
        const id = request.params[0];
        pool.query('SELECT long_link FROM links WHERE id = $1', [id], (error, results) => {
            if (error) {
                throw error
            }else if(results.rows.length==1){
                response.redirect(results.rows[0].long_link);
            }else{
                response.redirect(host);
            }
        })
    } catch (error) {
        response.redirect(host);
    }
}

function validURL(str) {
    regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(str)) {
        return true;
    }
    else {
        return false;
    }
}

module.exports = {

    createLink,
    resolveLink
}