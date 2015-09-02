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
            common : {
                files: [
                    {
                        expand: true,
                        cwd: '.build/',
                        src: ['common/**/*.js'],
                        dest: 'js/dist/',
                        ext: '.js'
                    }
                ]
            },
            app : {
                options : {
                    include : 'all'
                },
                files: [
                    {
                        expand: true,
                        cwd: '.build/',
                        src: ['app/**/*.js'],
                        dest: 'js/dist/',
                        ext: '.js'
                    }
                ]
            }
        },

        uglify : {
            styles : {
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['styles/**/*.js', '!styles/**/*-debug.js'],
                        dest: 'dist/',
                        ext: '.js'
                    }
                ]
            },
            app1 : {
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['app/**/*.js', '!app/**/*-debug.js'],
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
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('build-styles', ['transport:styles', 'concat:styles', 'uglify:styles', 'clean']);
    grunt.registerTask('build-app', ['transport:app1', 'concat:app1', 'uglify:app1', 'clean']);
//    grunt.registerTask('default', ['clean']);
};