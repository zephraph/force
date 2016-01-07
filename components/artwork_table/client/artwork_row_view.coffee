_ = require 'underscore'
Backbone = require 'backbone'
mediator = require '../../../lib/mediator.coffee'
PartnerLocations = require '../../../apps/artwork/components/partner_locations/index.coffee'
SaleArtworkView = require '../../artwork_item/views/sale_artwork.coffee'
ConfirmInquiryView = require '../../contact/confirm_inquiry.coffee'
analyticsHooks = require '../../../lib/analytics_hooks.coffee'
FlashMessage = require '../../flash/index.coffee'

template = -> require('../templates/artwork_row.jade') arguments...

module.exports = class ArtworkRowView extends SaleArtworkView
  displayPurchase: true

  className: 'artwork-table__row'
  attributes: -> data: artwork: @model.id

  initialize: (options = {})->
    { @$container, @model } = options
    @render()

    super

    @$('.artwork-table__cell--caption, .artwork-table__cell--image').hover \
      (=> @$('.hoverable-image-link').addClass 'is-hovered'), \
      (=> @$('.hoverable-image-link').removeClass 'is-hovered')

  render: ->
    @$el.html template
      artwork: @model
      displayPurchase: @displayPurchase

    @pl = new PartnerLocations $el: @$el, artwork: @model

    this

  contactSeller: (e) ->
    e.preventDefault()
    analyticsHooks.trigger 'artwork:contact-gallery'
    new ConfirmInquiryView
      artwork: @model
      partner: @model.get 'partner'
      success: =>
        new FlashMessage message: 'Thank you. Your message has been sent.'
