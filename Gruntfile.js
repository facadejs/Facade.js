module.exports = function (grunt) {

    'use strict';

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        jslint: {

            client: {
                src: ['facade.js', 'tests/**/*.js'],
                directives: {
                    nomen: true,
                    globals: {
                        'document': true,
                        'module': true,
                        'require': true,
                        'window': true
                    }
                }
            }

        },

        uglify: {

            my_target: {
                options: {
                    mangle: true,
                    report: 'gzip',
                    sourceMap: true,
                    banner: '/*!\n * <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("isoDateTime") %>\n * https://github.com/neogeek/facade.js\n * \n * Copyright (c) <%= grunt.template.today("yyyy") %> Scott Doxey\n * Dual-licensed under both MIT and BSD licenses.\n */\n'
                },
                files: {
                    'facade.min.js': ['facade.js']
                }
            }

        },

        casperjs: {

            files: ['tests/**/*.js']

        },

        shell: {

            docs: {

                command: 'dox < facade.js > docs/facade.json; cd docs/; doxdox.py --title="Facade.js" --description="Drawing shapes, images and text in HTML5 canvas made easy." > index.html; rm facade.json;'

            },

            gzip: {

                command: 'gzip -9 < facade.min.js > facade.min.js.gzip'

            },

            demos: {

                command: 'cp facade.min.js playground/; cd playground; python build.py > demos.js;'

            }

        },

        manifest: {

            generate: {

                options: {
                    basePath: 'playground/',
                    cache: [
                        'index.html',
                        'stage.html',
                        'styles.css',
                        'demos.js',
                        'play.js',
                        'facade.min.js',
                        'http://cdnjs.cloudflare.com/ajax/libs/ace/1.1.3/ace.js',
                        'http://cdnjs.cloudflare.com/ajax/libs/ace/1.1.3/mode-javascript.js',
                        'http://cdnjs.cloudflare.com/ajax/libs/ace/1.1.3/worker-javascript.js',
                        'http://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.3.0/handlebars.min.js',
                        'http://cdnjs.cloudflare.com/ajax/libs/zepto/1.1.3/zepto.min.js',
                    ],
                    network: ['*']
                },

                src: [
                    'playground/*'
                ],

                dest: 'playground/manifest.appcache'

            }

        },

        watch: {

            default: {
                files: ['facade.js', 'tests/**/*.js'],
                tasks: ['jslint', 'uglify', 'shell:docs', 'shell:gzip', 'casperjs']
            },

            demos: {
                files: ['playground/demos/**/*.js'],
                tasks: ['shell:demos', 'manifest']
            }

        }

    });

    grunt.registerTask('default', [ 'jslint', 'uglify', 'shell', 'manifest' ]);
    grunt.registerTask('demos', [ 'shell:demos', 'manifest' ]);
    grunt.registerTask('test', [ 'casperjs' ]);

};
