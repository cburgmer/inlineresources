"use strict";

var isPhantomJs = navigator.userAgent.indexOf("PhantomJS") >= 0,
    isRunFromTheProjectRoot = isPhantomJs;

exports.fixturesPath = (isRunFromTheProjectRoot ? 'test/' : '' ) + 'fixtures/';

exports.readHTMLFixture = function (url, callback) {
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

var deleteAdditionalFieldsFromErrorUnderPhantomJS = function (error) {
    var newErrorObject = {},
        additionalKeys = ['sourceId', 'sourceURL', 'stack', 'stackArray', 'line'];

    Object.keys(error).forEach(function (key) {
        if (additionalKeys.indexOf(key) === -1) {
            newErrorObject[key] = error[key];
        }
    });
    return newErrorObject;
};

exports.deleteAdditionalFieldsFromErrorsUnderPhantomJS = function (errors) {
    return errors.map(deleteAdditionalFieldsFromErrorUnderPhantomJS);
};
