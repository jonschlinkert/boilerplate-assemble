/*
 * boilerplate
 * https://github.com/assemble/boilerplate
 * Copyright (c) 2013
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // Project metadata
    pkg   : grunt.file.readJSON('package.json'),
    vendor: grunt.file.readJSON('.bowerrc').directory,
    site  : grunt.file.readYAML('_config.yml'),

    // Aliases
    bootstrap: '<%= vendor %>/bootstrap',

    // Build HTML from templates and data
    assemble: {
      options: {
        flatten: true,
        assets: '<%= site.assets %>',
        postprocess: require('pretty'),

        // Metadata
        pkg: '<%= pkg %>',
        site: '<%= site %>',
        data: ['<%= site.data %>'],

        // Templates
        partials: '<%= site.includes %>',
        layoutdir: '<%= site.layouts %>',
        layout: '<%= site.layout %>',

        // Extensions
        helpers: '<%= site.helpers %>',
        plugins: '<%= site.plugins %>'
      },
      example: {
        files: {'<%= site.dest %>/': ['<%= site.templates %>/*.hbs']}
      }
    },


    // Compile LESS to CSS
    less: {
      options: {
        paths: [
          '<%= site.theme %>',
          '<%= site.theme %>/bootstrap',
          '<%= site.theme %>/components',
          '<%= site.theme %>/utils'
        ],
      },
      site: {
        src: ['<%= site.theme %>/site.less'],
        dest: '<%= site.assets %>/css/site.css'
      }
    },


    // Copy Bootstrap's assets to site assets
    copy: {
      // Delete this target after first run!!!
      once: {
        files: [
          {expand: true, cwd: '<%= bootstrap %>/less',  src: ['*.*'], dest: '<%= site.theme %>/bootstrap/'},
          {expand: true, cwd: '<%= bootstrap %>/less',  src: ['variables.less'], dest: '<%= site.theme %>/'},
          {expand: true, cwd: '<%= bootstrap %>/less',  src: ['utilities.less'], dest: '<%= site.theme %>/utils'},
          {expand: true, cwd: '<%= bootstrap %>/less',  src: ['mixins.less'],    dest: '<%= site.theme %>/utils'},
        ]
      },
      // Keep this target
      assets: {
        files: [
          {expand: true, cwd: '<%= bootstrap %>/dist/fonts', src: ['*.*'], dest: '<%= site.assets %>/fonts/'},
          {expand: true, cwd: '<%= bootstrap %>/dist/js',    src: ['*.*'], dest: '<%= site.assets %>/js/'},
        ]
      }
    },


    // Lint JavaScript
    jshint: {
      all: ['Gruntfile.js', 'templates/helpers/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },


    // Before generating any new files,
    // remove any previously-created files.
    clean: {
      example: ['<%= site.dest %>/*.html'],
      // Delete this target after first run!!!
      once: ['<%= site.theme %>/bootstrap/{var*,mix*,util*}.*']
    },


    watch: {
      all: {
        files: ['<%= jshint.all %>'],
        tasks: ['jshint', 'nodeunit']
      },
      site: {
        files: ['Gruntfile.js', '<%= less.options.paths %>/*.less', 'templates/**/*.hbs'],
        tasks: ['design']
      }
    }
  });

  // Delete after first run
  if(!grunt.file.exists('vendor/bootstrap')) {
    grunt.fail.fatal('>> Please run "bower install" before continuing.');
  }


  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-readme');
  grunt.loadNpmTasks('assemble-less');
  grunt.loadNpmTasks('assemble');

  // Run this task once, then delete it as well as all of the "once" targets.
  grunt.registerTask('setup', ['copy:once', 'clean:once']);

  // Build HTML, compile LESS and watch for changes. You must first run "bower install"
  // or install Bootstrap to the "vendor" directory before running this command.
  grunt.registerTask('design', ['clean', 'assemble', 'less:site', 'watch:site']);

  // Default tasks to be run.
  grunt.registerTask('default', ['clean', 'jshint', 'copy:assets', 'assemble', 'less', 'readme']);
};
