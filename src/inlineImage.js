"use strict";

var util = require('./util');


var encodeImageAsDataURI = function (image, options) {
    var url = image.attributes.src ? image.attributes.src.nodeValue : null,
        documentBase = util.getDocumentBaseUrl(image.ownerDocument),
        ajaxOptions = util.clone(options);

    if (!ajaxOptions.baseUrl && documentBase) {
        ajaxOptions.baseUrl = documentBase;
    }

    return util.getDataURIForImageURL(url, ajaxOptions)
        .then(function (dataURI) {
            return dataURI;
        }, function (e) {
            throw {
                resourceType: "image",
                url: e.url,
                msg: "Unable to load image " + e.url
            };
        });
};

var filterExternalImages = function (images) {
    return images.filter(function (image) {
        var url = image.attributes.src ? image.attributes.src.nodeValue : null;

        return url !== null && !util.isDataUri(url);
    });
};

var filterInputsForImageType = function (inputs) {
    return Array.prototype.filter.call(inputs, function (input) {
        return input.type === "image";
    });
};

var toArray = function (arrayLike) {
    return Array.prototype.slice.call(arrayLike);
};

exports.inline = function (doc, options) {
    var images = toArray(doc.getElementsByTagName("img")),
        imageInputs = filterInputsForImageType(doc.getElementsByTagName("input")),
        externalImages = filterExternalImages(images.concat(imageInputs));

    return util.collectAndReportErrors(externalImages.map(function (image) {
        return encodeImageAsDataURI(image, options).then(function (dataURI) {
            image.attributes.src.nodeValue = dataURI;
        });
    }));
};
