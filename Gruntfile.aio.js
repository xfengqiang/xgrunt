module.exports = function (grunt) {
    var transport = require('grunt-cmd-transport');
    var style = transport.style.init(grunt);
    var text = transport.text.init(grunt);
    var script = transport.script.init(grunt);

    grunt.initConfig({
        pkg : grunt.file.readJSON("package.json"),

        transport : {
            options : {
                paths : ['./js/'],
                alias: '<%= pkg.spm.alias %>',
                parsers : {
                    '.js' : [script.jsParser],
                    '.css' : [style.css2jsParser],
                    '.html' : [text.html2jsParser]
                }
            },

            common : {
                options : {
                    idleading : 'dist/common/'
                },

                files : [
                    {
                        cwd : 'js/src/common',
                        src : '**/*',
                        filter : 'isFile',
                        dest : '.build/common'
                    }
                ]
            },

            app : {
                options : {
                    idleading : 'dist/app/'
                },

                files : [
                    {
                        cwd : 'js/src/app',
                        src : '**/*',
                        filter : 'isFile',
                        dest : '.build/app'
                    }
                ]
            }
        },
        concat : {
            options : {
                paths : ['./js/'],
                include : 'relative'
            },
            app : {
                files: [
                    {
                        src: ['.build/**/*.js', '!.build/**/*-debug.js'],
                        dest: 'js/dist/all.js'
                    },
                    {
                        src: ['.build/**/*-debug.js'],
                        dest: 'js/dist/all-debug.js'
                    }
                ]
            }
        },

        uglify : {
            app : {
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['all.js'],
                        dest: 'dist/',
                        ext: '.js'
                    }
                ]
            }
        },

        clean : {
            spm : ['.build']
        }
    });

    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('build-app', ['transport:app', 'concat:app', 'uglify:app', 'clean']);
//    grunt.registerTask('default', ['clean']);
};