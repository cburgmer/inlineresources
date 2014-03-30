inline-html-resources
=====================

<a href="https://www.npmjs.org/package/inline-html-resources">
    <img src="https://badge.fury.io/js/inline-html-resources.png"
         align="right" alt="NPM version" />
</a>

Inlines CSS, images, fonts and scripts in HTML documents.

See the [API](https://github.com/cburgmer/inline-html-resources/wiki/API).

Limitations
-----------

Resources referenced in the document (CSS, images, fonts and JS) can only be loaded if from the [same origin](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Same_origin_policy_for_JavaScript), unless techniques like [CORS](http://enable-cors.org) are used.

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
