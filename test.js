const cheerio = require("cheerio");
const Youtube = require('./dist/services/youtube').Youtube

async function proxyGenerator() {
    const y = new Youtube()
    console.log(await y.findSong('blinding lights'))
}

console.log(proxyGenerator())
