var cssSupport = require('../src/cssSupport');

describe("CSS support", function () {
    describe("extractCssUrl", function () {
        it("should extract a CSS URL", function () {
            var url = cssSupport.extractCssUrl('url(path/file.png)');
            expect(url).toEqual("path/file.png");
        });

        it("should handle double quotes", function () {
            var url = cssSupport.extractCssUrl('url("path/file.png")');
            expect(url).toEqual("path/file.png");
        });

        it("should handle single quotes", function () {
            var url = cssSupport.extractCssUrl("url('path/file.png')");
            expect(url).toEqual("path/file.png");
        });

        it("should handle whitespace", function () {
            var url = cssSupport.extractCssUrl('url(   path/file.png )');
            expect(url).toEqual("path/file.png");
        });

        it("should also handle tab, line feed, carriage return and form feed", function () {
            var url = cssSupport.extractCssUrl('url(\t\r\f\npath/file.png\t\r\f\n)');
            expect(url).toEqual("path/file.png");
        });

        it("should keep any other whitspace", function () {
            var url = cssSupport.extractCssUrl('url(\u2003\u3000path/file.png)');
            expect(url).toEqual("\u2003\u3000path/file.png");
        });

        it("should handle whitespace with double quotes", function () {
            var url = cssSupport.extractCssUrl('url( "path/file.png"  )');
            expect(url).toEqual("path/file.png");
        });

        it("should handle whitespace with single quotes", function () {
            var url = cssSupport.extractCssUrl("url( 'path/file.png'  )");
            expect(url).toEqual("path/file.png");
        });

        it("should extract a data URI", function () {
            var url = cssSupport.extractCssUrl('url("data:image/png;base64,soMEfAkebASE64=")');
            expect(url).toEqual("data:image/png;base64,soMEfAkebASE64=");
        });

        it("should throw an exception on invalid CSS URL", function () {
            expect(function () {
                cssSupport.extractCssUrl('invalid_stuff');
            }).toThrow(new Error("Invalid url"));
        });
    });
});
