/*
 * grunt-rImage
 * https://github.com/alexflorisca/rimage
 *
 * Copyright (c) 2015 Alex Florisca
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var cheerio = require('cheerio');
  


  var getFilename = function(str) {
    var file = {
      path: str.slice(0, str.lastIndexOf("/")),
      name: str.slice(str.lastIndexOf("/")+1, str.lastIndexOf("-")),
      type: str.slice(str.lastIndexOf(".")+1)
    };
    return file;
  };


  var buildSrcset = function(src, imageSizes) {
    var file = getFilename(src),
        srcset = "",
        i = 0;

    for(i = 0; i < imageSizes.length; i++) {
      srcset += file.path + "/" + file.name + "-" + imageSizes[i].name + "." + file.type + " " + imageSizes[i].width + "w,";
    }

    srcset = srcset.substr(0, srcset.length-1);

    return srcset;
  };



  var processImages = function(content, options) {


    var $ = cheerio.load(content),
        images = $("img[data-responsive]"),
        processedImgs = 0;

        images.each(function() {
          var image =     $(this),
              src =       image.attr("src"),
              srcset =    "";

          // Only images that don't yet have srcset attributes
          var hasSrcset = image.attr("srcset") !== undefined;

          if(hasSrcset) {
            return;
          }

          srcset = buildSrcset(src, options.imageSizes);
          grunt.log.writeln(srcset);

          image.attr("srcset", srcset);
          processedImgs++;
        });

        return { content: $.html(), totalCount: images.length, processedCount: processedImgs };
    };

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('rimage', 'Responsive images', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    
    var options = this.options({
      original_image_dir: 'images/originals',
      optimised_image_dir: 'images/optimised',
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
    });


    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      var content = grunt.file.read(f.src);
      var result = processImages(content, options);

      grunt.file.write(f.dest, result.content);
      grunt.log.writeln("Found " + result.totalCount + " images. Processed " + result.processedCount);
    });
  });

};
