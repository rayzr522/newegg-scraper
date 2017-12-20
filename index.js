const got = require('got')
const cheerio = require('cheerio')

const SEARCH_URL = 'https://www.newegg.com/Product/ProductList.aspx?Submit=ENE&Order=BESTMATCH&Description='

const getSearchURL = query => SEARCH_URL + encodeURIComponent(query)

const scrape = async query => {
    let searchURL = getSearchURL(query)

    let response = await got(searchURL)
    if (response.statusCode !== 200) {
        throw new Error(`Failed to fetch website contents, got response code: ${response.statusCode}`)
    }

    const $ = cheerio.load(response.body)

    let results = []

    $('.items-view > .item-container').each(function () {
        let itemInfo = $(this).children('.item-info')
        let link = itemInfo.children('a')
        let description = link.text()
        let url = link.attr('href')

        let itemAction = itemInfo.children('.item-action')
        let prices = $(itemAction).children('.price')
        let priceCurrentNode = $(prices).children('.price-current')
        let priceCurrent = '$' + priceCurrentNode.children('strong').text() + priceCurrentNode.children('sup').text()
        let priceWas = $(prices).find('.price-was > .price-was-data').text().trim()
        if (priceWas) priceWas = '$' + priceWas

        let price = priceWas || priceCurrent
        let sale = priceWas ? priceCurrent : undefined

        results.push({ description, url, price, sale })
    })

    return results
}

module.exports = scrape