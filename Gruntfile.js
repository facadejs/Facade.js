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
                        'module': true,
                        'require': true,
                        'window': true,
                        'document': true
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

        watch: {

            jslint: {
                files: ['facade.js', 'tests/**/*.js'],
                tasks: ['jslint']
            },

            uglify: {
                files: ['facade.js', 'tests/**/*.js'],
                tasks: ['uglify']
            },

            casperjs: {
                files: ['facade.js', 'tests/**/*.js'],
                tasks: ['casperjs']
            },

        }

    });

    grunt.registerTask('default', [ 'uglify', 'casperjs', 'jslint' ]);

};