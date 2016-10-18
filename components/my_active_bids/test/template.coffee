template = require('jade').compileFile(require.resolve '../template.jade')
cheerio = require 'cheerio'
fixture = -> [
  {
    "id": "56ba482e8b3b8167d7000000",
    "sale_artwork": {
      "id": "ed-ruscha-cockroaches-from-insects-portfolio",
      "lot_number": "10",
      "counts": {
        "bidder_positions": 5,
      },
      "highest_bid": {
        "amount": "$4,000"
      },
      "artwork": {
        "image": {
          "url": "https://d32dm0rphc51dk.cloudfront.net/0-AL7CEZ5IDjCWdNxwjmBg/tall.jpg"
        },
        "href": "/artwork/ed-ruscha-cockroaches-from-insects-portfolio",
        "artist": {
          "name": "Ed Ruscha"
        }
      }
    }
  }
]

describe 'My Active Bids template', ->

  beforeEach ->
    @locals =
      myActiveBids: fixture()
      accounting: formatMoney: (s) -> s

  it 'renders highest bid if user is leading bidder and reserve met\
      bidder positon match', ->
    @locals.myActiveBids[0].is_leading_bidder = true
    @locals.myActiveBids[0].sale_artwork.reserve_status = 'reserve_met'
    $ = cheerio.load(template(@locals))
    $('.bid-status').text().should.containEql 'Highest Bid'
    $('.bid-status__is-winning').length.should.equal 1

  it 'renders highest bid if leading bidder and reserve not met \
      bidder positon do not match', ->
    @locals.myActiveBids[0].is_leading_bidder = true
    @locals.myActiveBids[0].sale_artwork.reserve_status = 'reserve_not_met'
    $ = cheerio.load(template(@locals))
    $('.bid-status').text().should.containEql 'Highest Bid'
    $('.bid-status__is-winning-reserve-not-met').length.should.equal 1

  it 'renders losing if not leading bidder & reserve not met', ->
    @locals.myActiveBids[0].is_leading_bidder = false
    @locals.myActiveBids[0].sale_artwork.reserve_status = 'reserve_not_met'
    $ = cheerio.load(template(@locals))
    $('.bid-status').text().should.containEql 'Outbid'
    $('.bid-status__is-losing').length.should.equal 1

  it 'renders losing if not leading bidder & reserve is met', ->
    @locals.myActiveBids[0].is_leading_bidder = false
    @locals.myActiveBids[0].sale_artwork.reserve_status = 'reserve_met'
    $ = cheerio.load(template(@locals))
    $('.bid-status').text().should.containEql 'Outbid'
    $('.bid-status__is-losing').length.should.equal 1
