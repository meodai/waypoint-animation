/*global module:false*/

"use strict";

module.exports = function(grunt) {

  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    watch: {
      linting: {
        files: "*.js",
        tasks: ["eslint"]
      }
    },
    eslint: {
      options: {
          config: ".eslintrc"
      },
      files: ["*.js"]
    }
  });

  // Default task.
  grunt.registerTask("default", ["eslint"]);
  grunt.registerTask("dev",     ["eslint", "watch"]);

};
