module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        mocha: {
            test: {
                options: {
                    run: true
                },
                src: ['./test/index.html']
            }
        }
    });

    grunt.registerTask('default', ['mocha']);

};
