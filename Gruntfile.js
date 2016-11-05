/*global module:false*/
"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        karma: {
            options: {
                files: [
                    // http://stackoverflow.com/questions/29391111/karma-phantomjs-and-es6-promises
                    'node_modules/babel-polyfill/dist/polyfill.js',
                    'build/testSuite.js',
                    {pattern: 'test/fixtures/**', included: false}
                ],
                frameworks: ['jasmine'],
                reporters: 'dots'
            },
            ci: {
                proxies: {
                    '/test/fixtures/': 'http://localhost:9988/base/test/fixtures/'
                },
                port: 9988,
                singleRun: true,
                browsers: ['PhantomJS']
            },
            local: {
                proxies: {
                    '/fixtures/': 'http://localhost:9989/base/test/fixtures/'
                },
                port: 9989,
                background: true,
                singleRun: false
            }
        },
        exec: {
            // work around https://github.com/substack/node-browserify/pull/1151
            bundle: './node_modules/.bin/browserify --standalone <%= pkg.name %> --external url --external css-font-face-src --external cssom src/inline.js | ./node_modules/.bin/derequire > build/<%= pkg.name %>.bundled.js'
        },
        browserify: {
            xmlserializer: {
                src: [],
                dest: 'build/dependencies/xmlserializer.js',
                options: {
                    require: ['xmlserializer'],
                    browserifyOptions: {
                        standalone: 'xmlserializer'
                    }
                }
            },
            url: {
                src: [],
                dest: 'build/dependencies/url.js',
                options: {
                    require: ['url'],
                    browserifyOptions: {
                        standalone: 'url'
                    }
                }
            },
            cssom: {
                src: [],
                dest: 'build/dependencies/cssom.js',
                options: {
                    require: ['cssom'],
                    browserifyOptions: {
                        standalone: 'cssom'
                    }
                }
            },
            testSuite: {
                src: 'test/specs/*.js',
                dest: 'build/testSuite.js',
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                }
            }
        },
        clean: {
            dist: ['build/*.js', 'build/dependencies/', 'dist/'],
            all: ['build']
        },
        concat: {
            dist: {
                options: {
                    // Work around https://github.com/substack/node-browserify/issues/670
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                        '* <%= pkg.homepage %>\n' +
                        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                        ' Licensed <%= pkg.license %> */\n' +
                        ["// UMD header",
                         "(function (root, factory) {",
                         "    if (typeof define === 'function' && define.amd) {",
                         "        define(['url', 'css-font-face-src', 'cssom'], function (a0,b1,c2) {",
                         "            return (root['<%= pkg.name %>'] = factory(a0,b1,c2));",
                         "        });",
                         "    } else if (typeof exports === 'object') { // browserify context",
                         "        var cssom;",
                         "        try { cssom = require('cssom'); } catch (e) {}",
                         "        var f = factory(require('url'), require('css-font-face-src'), cssom);",
                         "        for(var prop in f) exports[prop] = f[prop];",
                         "    } else {",
                         "        root['<%= pkg.name %>'] = factory(url,cssFontFaceSrc,window.cssom);",
                         "    }",
                         "}(this, function (url, cssFontFaceSrc, cssom) {",
                         "    var modules = {url: url, 'css-font-face-src': cssFontFaceSrc, cssom: cssom};",
                         "    var require = function (name) { if (modules[name]) { return modules[name]; } else { throw new Error('Module not found: ' + name); }; };",
                         "    // cheat browserify module to leave the function reference for us",
                         "    var module = {}, exports={};",
                         "    // from here on it's browserify all the way\n"].join('\n'),
                    footer: ["\n    // back to us",
                             "    return module.exports;",
                             "}));\n"].join('\n')
                },
                src: ['build/<%= pkg.name %>.bundled.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        watch: {
            karma: {
                files: [
                    'src/*.js',
                    'test/specs/*.js',
                    // Ignore files generated by flycheck
                    '!**/flycheck_*.js'
                ],
                tasks: ['browserify:testSuite', 'karma:local:run']
            },
            karmaci: {
                files: [
                    'src/*.js',
                    'test/specs/*.js',
                    // Ignore files generated by flycheck
                    '!**/flycheck_*.js'
                ],
                tasks: ['browserify:testSuite', 'karma:ci']
            },
            build: {
                files: [
                    'src/*.js',
                    'test/specs/*.js'
                ],
                tasks: ['browserify:testSuite']
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                undef: true,
                unused: true,
                eqnull: true,
                trailing: true,
                browser: true,
                node: true,
                strict: true,
                globals: {
                    Promise: true,
                    require: true,
                    exports: true,

                    cssom: true,
                    url: true
                },
                exported: ['inline', 'inlineCss', 'inlineUtil']
            },
            uses_defaults: [
                'src/*.js',
                'Gruntfile.js',
            ],
            with_overrides: {
                options: {
                    globals: {
                        Promise: true,
                        jasmine: true,
                        describe: true,
                        it: true,
                        xit: true,
                        beforeEach: true,
                        afterEach: true,
                        expect: true,
                        spyOn: true,

                        cssom: true,
                        url: true
                    },
                    ignores: ['test/fixtures/']
                },
                files: {
                    src: ['test/']
                }
            }
        },
        "regex-check": {
            files: [
                'src/*',
                // 'test/{,*/}*'
                'test/*.html',
                'test/*.js',
                'test/*/*.html',
            ],
            options: {
                pattern : /FIXME/g
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-regex-check');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-umd');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('testDeps', [
        'browserify:xmlserializer',
        'browserify:url',
        'browserify:cssom'
    ]);

    grunt.registerTask('testWatch', [
        'karma:local:start',
        'watch:karma'
    ]);

    grunt.registerTask('testWatchCi', [
        'karma:local:start',
        'watch:karmaci'
    ]);

    grunt.registerTask('test', [
        'browserify:testSuite',
        'jshint',
        'karma:ci',
        'regex-check'
    ]);

    grunt.registerTask('build', [
        'exec:bundle',
        'concat:dist'
    ]);

    grunt.registerTask('default', [
        'clean:dist',
        'testDeps',
        'test',
        'build'
    ]);

};
