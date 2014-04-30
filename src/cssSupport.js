"use strict";

var cssom = require('cssom');


exports.unquoteString = function (quotedUrl) {
    var doubleQuoteRegex = /^"(.*)"$/,
        singleQuoteRegex = /^'(.*)'$/;

    if (doubleQuoteRegex.test(quotedUrl)) {
        return quotedUrl.replace(doubleQuoteRegex, "$1");
    } else {
        if (singleQuoteRegex.test(quotedUrl)) {
            return quotedUrl.replace(singleQuoteRegex, "$1");
        } else {
            return quotedUrl;
        }
    }
};

var rulesForCssTextFromBrowser = function (styleContent) {
    var doc = document.implementation.createHTMLDocument(""),
        styleElement = document.createElement("style"),
        rules;

    styleElement.textContent = styleContent;
    // the style will only be parsed once it is added to a document
    doc.body.appendChild(styleElement);
    rules = styleElement.sheet.cssRules;

    return Array.prototype.slice.call(rules);
};

var browserHasBackgroundImageUrlIssue = (function () {
    // Checks for http://code.google.com/p/chromium/issues/detail?id=161644
    var rules = rulesForCssTextFromBrowser('a{background:url(i)}');
    return !rules.length || rules[0].cssText.indexOf('url()') >= 0;
}());

exports.rulesForCssText = function (styleContent) {
    if (browserHasBackgroundImageUrlIssue && cssom.parse) {
        return cssom.parse(styleContent).cssRules;
    } else {
        return rulesForCssTextFromBrowser(styleContent);
    }
};

exports.cssRulesToText = function (cssRules) {
    return cssRules.reduce(function (cssText, rule) {
        return cssText + rule.cssText;
    }, '');
};

exports.exchangeRule = function (cssRules, rule, newRuleText) {
    var ruleIdx = cssRules.indexOf(rule),
        styleSheet = rule.parentStyleSheet;

    // Generate a new rule
    styleSheet.insertRule(newRuleText, ruleIdx+1);
    styleSheet.deleteRule(ruleIdx);
    // Exchange with the new
    cssRules[ruleIdx] = styleSheet.cssRules[ruleIdx];
};

// Workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=443978
exports.changeFontFaceRuleSrc = function (cssRules, rule, newSrc) {
    var newRuleText = '@font-face { font-family: ' + rule.style.getPropertyValue("font-family") + '; ';

    if (rule.style.getPropertyValue("font-style")) {
        newRuleText += 'font-style: ' + rule.style.getPropertyValue("font-style") + '; ';
    }

    if (rule.style.getPropertyValue("font-weight")) {
        newRuleText += 'font-weight: ' + rule.style.getPropertyValue("font-weight") + '; ';
    }

    newRuleText += 'src: ' + newSrc + '}';
    exports.exchangeRule(cssRules, rule, newRuleText);
};
