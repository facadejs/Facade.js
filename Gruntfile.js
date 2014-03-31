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
                    banner: '/*!\n * <%= pkg.name %> v<%= pkg.version %>\n * https://github.com/neogeek/facade.js\n * \n * Copyright (c) <%= grunt.template.today("yyyy") %> Scott Doxey\n * Dual-licensed under both MIT and BSD licenses.\n */\n'
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

                command: 'cd playground; python build.py > demos.js;'

            }

        },

        watch: {

            default: {
                files: ['facade.js', 'tests/**/*.js'],
                tasks: ['jslint', 'uglify', 'shell:gzip', 'shell:docs', 'casperjs']
            },

            demos: {
                files: ['playground/demos/**/*.js'],
                tasks: ['shell:demos']
            }

        }

    });

    grunt.registerTask('default', [ 'uglify', 'jslint', 'shell:gzip', 'shell:docs' ]);
    grunt.registerTask('demos', [ 'shell:demos' ]);
    grunt.registerTask('test', [ 'casperjs' ]);

};
