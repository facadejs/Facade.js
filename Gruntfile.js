module.exports = function (grunt) {

    'use strict';

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        casperjs: {

            files: ['tests/**/*.js']

        },

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
                    sourceMap: 'facade.min.map.js',
                    banner: '/*!\n * <%= pkg.name %> v<%= pkg.version %>\n * https://github.com/neogeek/facade.js\n * \n * Copyright (c) <%= grunt.template.today("yyyy") %> Scott Doxey\n * Dual-licensed under both MIT and BSD licenses.\n */\n'
                },
                files: {
                    'facade.min.js': ['facade.js']
                }
            }

        },

        watch: {

            casperjs: {
                files: ['facade.js', 'tests/**/*.js'],
                tasks: ['casperjs']
            },
            jslint: {
                files: ['facade.js', 'tests/**/*.js'],
                tasks: ['jslint']
            }

        }

    });

    grunt.registerTask('default', [ 'uglify', 'casperjs', 'jslint' ]);

};