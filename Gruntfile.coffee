module.exports = (grunt) ->

  grunt.initConfig

    pkg: grunt.file.readJSON 'package.json'


    sass:
      tree:
        options:
          style: 'expanded'
          bundleExec: true
        files:
          'lib/tree.css': 'src/tree.scss'

    coffee:
      tree:
        files:
          'lib/tree.js': 'src/tree.coffee'
      spec:
        files:
          'spec/tree-spec.js': 'spec/tree-spec.coffee'

    watch:
      styles:
        files: ['src/*.scss']
        tasks: ['sass']
      scripts:
        files: ['src/*.coffee', 'spec/*.coffee']
        tasks: ['coffee']
      jasmine:
        files: [
          'lib/tree.css',
          'lib/tree.js',
          'specs/*.js'
        ],
        tasks: 'jasmine:test:build'

    jasmine:
      test:
        src: ['lib/tree.js']
        options:
          outfile: 'spec/index.html'
          styles: 'lib/tree.css'
          specs: 'spec/tree-spec.js'
          vendor: [
            'vendor/bower/jquery/dist/jquery.min.js',
            'vendor/bower/simple-module/lib/module.js',
            'vendor/bower/simple-util/lib/util.js'
          ]

  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-contrib-connect'

  grunt.registerTask 'default', ['coffee', 'jasmine:test:build', 'watch']
