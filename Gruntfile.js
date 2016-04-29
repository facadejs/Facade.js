module.exports = function (grunt) {

    'use strict';

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        jshint: {

            client: {
                src: ['facade.js', 'tests/**/*.js'],
                directives: {
                    browser: true,
                    globals: {
                        'define': true,
                        'module': true,
                        'require': true
                    },
                    nomen: true
                }
            }

        },

        uglify: {

            my_target: {
                options: {
                    mangle: true,
                    report: 'gzip',
                    banner: '/*!\n * <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("isoDateTime") %>\n * https://github.com/facadejs/facade.js\n * \n * Copyright (c) <%= grunt.template.today("yyyy") %> Scott Doxey\n * Released under the MIT license.\n */\n'
                },
                files: {
                    'facade.min.js': ['facade.js']
                }
            }

        },

        casperjs: {

            files: ['tests/**/*.js']

        },

        doxdox: {

            markdown: {
                input: 'facade.js',
                output: 'docs/README.md',
                config: {
                    layout: 'Markdown'
                }
            }

        },

        shell: {

            gzip: {

                command: 'gzip -9 < facade.min.js > facade.min.js.gzip'

            }

        },

        watch: {

            default: {
                files: ['facade.js', 'tests/**/*.js'],
                tasks: ['jshint', 'uglify', 'shell:docs', 'shell:gzip', 'casperjs']
            }

        }

    });

    grunt.registerTask('default', [ 'jshint', 'uglify', 'doxdox', 'shell' ]);
    grunt.registerTask('test', [ 'casperjs' ]);

};
