#!/usr/bin/env node

const http = require('http'),
      url = require('url'),
      fs = require('fs'),
      path = require('path'),
      puppeteer = require('puppeteer');

const port = 8000;

const contentTypeMap = {
    'html': 'text/html',
    'htm': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript'
};

const guessContentType = function (fileName) {
    const fallback = 'text/plain';

    if (fileName.lastIndexOf('.') < 1) {
        return fallback;
    }

    const extension = fileName.substr(fileName.lastIndexOf('.') + 1);
    return contentTypeMap[extension] || fallback;
};

const startWebserver = function () {
    http.createServer((request, response) => {
        const localPath = '.' + decodeURIComponent(url.parse(request.url).pathname);

        if (fs.existsSync(localPath)) {
            // Content-Type to work around https://bugzilla.mozilla.org/show_bug.cgi?id=942138
            response.writeHead(200, {"Content-Type": guessContentType(localPath)});
            response.write(fs.readFileSync(localPath, {flag: 'r'}));
            response.end();
        } else {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
        }

    }).listen(port);
};

const getFileUrl = function (address) {
    return address.indexOf("://") === -1 ? "http://localhost:" + port + "/" + address : address;
};

const bundlePage = async (url) => {
    const browser = await puppeteer.launch(),
          page = await browser.newPage(),
          pageUrl = getFileUrl(url);

    page.on('console', msg => {
        for (let i = 0; i < msg.args().length; ++i) {
            console.warn(`${i}: ${msg.args()[i]}`);
        }
    });
    page.on('pageerror', msg => {
        console.error(msg);
    });

    await page.goto(getFileUrl('examples/bundlePage.html'));

    const xhtml = await page.evaluate(function (pageUrl) {
        return bundlePage(pageUrl);
    }, pageUrl);
    console.log(xhtml);

    browser.close();
};

const main = async () => {
    if (process.argv.length !== 3) {
        console.log('Usage: ' + path.basename(process.argv[1]) + ' PAGE_TO_INLINE');
        console.log("Inlines resources of a given page into one big XHTML document");
        process.exit(1);
    }

    const pageToInline = process.argv[2];

    startWebserver();
    await bundlePage(pageToInline);
};

(async () => {
    try {
        await main();
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
