require '../lib/analytics_hooks.coffee'
$ -> analytics.ready ->
  require '../analytics/main_layout.js'
  require '../analytics/articles.js'
  require '../analytics/gallery_partnerships.js'
  require '../analytics/artworks_filter.js'
