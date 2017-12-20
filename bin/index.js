#!/usr/bin/env node
const scraper = require('..')

const fail = message => {
    global.console.error(message)
    process.exit(1)
}

const main = async args => {
    if (args.length < 1) {
        return fail('Usage: newegg-scraper <query>')
    }

    let query = args.join(' ')

    try {
        let results = await scraper(query)

        global.console.log(results.map(item => `### ${item.description}\n- ${item.url}\n  Price: ${item.price}\n  Sale: ${item.sale || 'none'}\n`).join('\n'))
    } catch (err) {
        fail(err.message)
    }
}

main(process.argv.slice(2))