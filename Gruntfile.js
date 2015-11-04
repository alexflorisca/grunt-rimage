/*
 * rImage
 * https://github.com/alexflorisca/rimage
 *
 * Copyright (c) 2015 Alex Florisca
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    rimage: {
      default_options: {
        options: {
          original_images_dir: 'images/originals',
          optimised_images_dir: 'images/optimised',
          imageSizes: [
            {
              width: 320,
              name: 'small'
            },
            {
              width: 640,
              name: 'medium'
            },
            {
              width: 1024,
              name: 'large'
            },
            {
              width: 1440,
              name: 'xlarge'
            },
            {
              width: 2048,
              name: 'xxlarge'
            }
          ]
        },
        files: {
          'tmp/default_options': ['test/fixtures/testing']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'rimage']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
