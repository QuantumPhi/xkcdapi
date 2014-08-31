module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        cssc: {
            build: {
                options: {
                    consolidateViaDeclarations: true,
                    consolidateViaSelectors:    true,
                    consolidateMediaQueries:    true
                }
            },
            files: {
                'stylesheets/style.css': 'stylesheets/style.css'
            }
        },

        cssmin: {
            build: {
                src: 'stylesheets/style.css',
                dest: 'stylesheets/style.css'
            }
        },

        sass: {
            build: {
                files: {
                    'stylesheets/style.css': 'stylesheets/sass/style.{scss,sass}'
                }
            }
        },

        uglify: {
            build: {
                files: {
                    'index.min.js': ['javascript/index.js']
                }
            }
        },

        watch: {
            js: {
                files: ['javascript/index.js'],
                tasks: ['uglify']
            },

            css: {
                files: ['stylesheets/sass/**/*.{scss,sass}'],
                tasks: ['buildcss']
            }
        }
    })

    grunt.registerTask('default', ['uglify', 'buildcss'])
    grunt.registerTask('heroku:production', ['uglify', 'buildcss'])
    grunt.registerTask('buildcss', ['sass', 'cssc', 'cssmin'])
}
