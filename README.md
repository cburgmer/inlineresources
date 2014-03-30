inline-html-resources
=====================

<a href="https://www.npmjs.org/package/inline-html-resources">
    <img src="https://badge.fury.io/js/inline-html-resources.png"
         align="right" alt="NPM version" />
</a>

Inlines CSS, images, fonts and scripts in HTML documents. Works in the browser.

See the [API](https://github.com/cburgmer/inline-html-resources/wiki/API).

Limitations
-----------

Resources referenced in the document (CSS, images, fonts and JS) can only be loaded if from the [same origin](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Same_origin_policy_for_JavaScript), unless techniques like [CORS](http://enable-cors.org) are used.

Similar projects for Node.js
----------------------------

* [jasonbellamy/asset-inliner](https://github.com/jasonbellamy/asset-inliner)
* [cdata/collapsify](https://github.com/cdata/collapsify)
* [EE/grunt-inline-images](https://github.com/EE/grunt-inline-images)
* [popeindustries/inline-source](https://github.com/popeindustries/inline-source)
* [LearnBoost/juice](https://github.com/LearnBoost/juice)
* [fb55/node-inline](https://github.com/fb55/node-inline)
* [callumlocke/resource-embedder](https://github.com/callumlocke/resource-embedder)
* [kevva/rework-inline](https://github.com/kevva/rework-inline)
* [andreypopp/xcss-inline-woff](https://github.com/andreypopp/xcss-inline-woff)
* ... and many more

Development
-----------

For linting, tests and minification install Node.js and Firefox and run

    $ ./go

[![Build Status](https://secure.travis-ci.org/cburgmer/inline-html-resources.png?branch=master)](http://travis-ci.org/cburgmer/inline-html-resources)

Where is it used?
-----------------

* [rasterizeHTML.js](https://github.com/cburgmer/rasterizeHTML.js), Renders HTML into the browser's canvas
* ...

Author
------
Christoph Burgmer. Licensed under MIT. Reach out [on Twitter](https://twitter.com/cburgmer).
