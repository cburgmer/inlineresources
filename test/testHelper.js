"use strict";

var isPhantomJs = navigator.userAgent.indexOf("PhantomJS") >= 0,
    isRunFromTheProjectRoot = isPhantomJs;

exports.isChrome = navigator.userAgent.indexOf("Chrom") >= 0;
exports.ifNotInChromeIt = function(text, functionHandle) {
    if (! exports.isChrome) {
        return it(text, functionHandle);
    } else {
        console.log('Warning: "' + text + '" is disabled on this platform');
        return xit(text, functionHandle);
    }
};

exports.fixturesPath = (isRunFromTheProjectRoot ? 'test/' : '' ) + 'fixtures/';

exports.readHTMLFixture = function (url) {
    var fixtureUrl = exports.fixturesPath + url,
        xhr = new window.XMLHttpRequest();

    xhr.open('GET', fixtureUrl, false);
    xhr.send(null);
    return xhr.response;
};

exports.readDocumentFixture = function (url) {
    var fixtureUrl = exports.fixturesPath + url,
        xhr = new window.XMLHttpRequest();

    xhr.open('GET', fixtureUrl, false);
    xhr.overrideMimeType('text/xml');
    xhr.send(null);
    return xhr.responseXML;
};

exports.readDocumentFixtureWithoutBaseURI = function (url) {
    var html = exports.readHTMLFixture(url),
        doc = document.implementation.createHTMLDocument("");

    doc.documentElement.innerHTML = html;
    return doc;
};

exports.addStyleToDocument = function (doc, styleContent) {
    var styleNode = doc.createElement("style");

    styleNode.type = "text/css";
    styleNode.appendChild(doc.createTextNode(styleContent));

    doc.getElementsByTagName('head')[0].appendChild(styleNode);
};
