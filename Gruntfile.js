var shim = require('browserify-shim');

module.exports = function(grunt) {
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    cfg: {
      cache: {
        header: 'public,max-age=604800',
        files: 'build/**/*.{css,js}'
      }
    },
    clean: {
      build: [
        'build'
      ]
    },
    compass: {
      dist: {
        options: {
          sassDir: 'work/sass',
          cssDir: 'contents/css',
          environment: 'production',
          require: 'zurb-foundation'
        }
      },
      dev: {
        options: {
          sassDir: 'work/sass',
          cssDir: 'contents/css',
          environment: 'development',
          require: 'zurb-foundation'
        }
      }
    },
    browserify2: {
      compile: {
        entry: './work/js/app.js',
        compile: './contents/js/app.min.js',
        beforeHook: function(bundle) {
          shim(bundle, {
            jquery: {
              path: './work/js/vendor/jquery/jquery.js',
              exports: '$'
            }
          });
        }
      }
    },
    imagemin: {
      dist: {
        options: {
          optimizationLevel: 3
        },
        files: [
          {
            expand: true,
            cwd: 'build/',
            src: ['**/*.jpg'],
            dest: 'build/',
            ext: '.jpg'
          },
          {
            expand: true,
            cwd: 'build/',
            src: ['**/*.png'],
            dest: 'build/',
            ext: '.png'
          }
        ]
      }
    },
    jshint: {
      work: [
        'work/js/*.js',
        'Gruntfile.js' ]
    },
    wintersmith: {
      staging: {
        options: {
          config: './config-staging.json'
        }
      },
      production: {
        options: {
          config: './config-production.json'
        }
      },
      preview: {
        options: {
          action: "preview",
          config: './config-preview.json'
        }
      }
    },
    shell: {
      bumpVersion: {
        command: 'npm version patch'
      }
    },
    uglify: {
      production: {
        files: {
          'build/js/app.min.js': 'build/js/app.min.js'
        }
      }
    },
    watch: {
      js: {
        files: [
          'work/js/**/*.js'
        ],
        tasks: ['jshint:work', 'browserify2']
      },
      sass: {
        files: [
          'work/sass/**/*.scss'
        ],
        tasks: [
          'compass:dev'
        ]
      }
    },
    lineremover: {
      html: {
        files: [
          {
            expand: true,
            cwd: 'build/',
            src: ['**/*.html'],
            dest: 'build/',
            ext: '.html'
          }
        ]
      },
      xml: {
        files: [
          {
            expand: true,
            cwd: 'build/',
            src: ['**/*.xml'],
            dest: 'build/',
            ext: '.xml'
          }
        ]
      }
    },
    s3: {
      options: {
        key: process.env.AWS_ACCESS_KEY_ID,
        secret: process.env.AWS_SECRET_ACCESS_KEY,
        access: 'public-read'
      },
      staging: {
        options: {
          bucket: 'livestaging.davidtucker.net'
        },
        upload: [
          {
            src: 'build/**/*.*',
            dest: '/',
            rel: 'build'
          }
        ]
      },
      production: {
        options: {
          bucket: 'davidtucker.net'
        },
        upload: [
          {
            src: 'build/**/*.*',
            dest: '/',
            rel: 'build'
          }
        ]
      },
      stagingCached: {
        options: {
          bucket: 'livestaging.davidtucker.net',
          headers: {
            'Cache-Control': '<%= cfg.cache.header %>'
          }
        },
        upload: [
          {
            src: '<%= cfg.cache.files %>',
            dest: '/',
            rel: 'build'
          }
        ]
      },
      productionCached: {
        options: {
          bucket: 'davidtucker.net',
          headers: {
            'Cache-Control': '<%= cfg.cache.header %>'
          }
        },
        upload: [
          {
            src: '<%= cfg.cache.files %>',
            dest: '/',
            rel: 'build'
          }
        ]
      },
    },
    hashres: {
      options: {
        encoding: 'utf8',
        fileNameFormat: '${name}.${hash}.cache.${ext}',
        renameFiles: true
      },
      css: {
        options: {
        },
        src: [
          'build/js/app.min.js',
          'build/css/app.css',
          'build/css/normalize.css' ],
        dest: 'build/**/*.html'
      },
      js: {
        options: {
        },
        src: [
          'build/js/app.min.js',
          'build/css/app.css',
          'build/css/normalize.css' ],
        dest: 'build/**/*.html'
      },
      images: {
        options: {
        },
        src: [
          'build/**/*.png',
          'build/**/*.jpg'
        ],
        dest: [
          'build/**/*.html',
          'build/**/*.js',
          'build/**/*.css',
          'build/**/*.md'
        ]
      }
    },
    cssmin: {
      production: {
        expand: true,
        cwd: 'build/css',
        src: ['*.css'],
        dest: 'build/css'
      }
    }
  });

  // Load NPM Tasks

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-browserify2');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-line-remover');
  grunt.loadNpmTasks('grunt-s3');
  grunt.loadNpmTasks('grunt-hashres');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-wintersmith');

  // Grunt Tasks

  grunt.registerTask('release', [
    'shell:bumpVersion'
  ]); 

  grunt.registerTask('dev', [
    'watch'
  ]);

  grunt.registerTask('cacheBust', [
    'hashres:images',
    'hashres:css',
    'hashres:js'
  ]);

  grunt.registerTask('preview', [
    'wintersmith:preview'
  ]);

  grunt.registerTask('prebuild', [
    'clean:build',
    'browserify2',
    'compass:dist'
  ]);

  grunt.registerTask('postbuild', [
    'lineremover',
    'imagemin:dist',
    'uglify:production',
    'cacheBust',
    'cssmin:production'
  ]);

  grunt.registerTask('buildStaging', [
    'prebuild',
    'wintersmith:staging',
    'postbuild'
  ]);

  grunt.registerTask('buildProduction', [
    'prebuild',
    'wintersmith:production',
    'postbuild'
  ]);

  grunt.registerTask('deployStaging', [
    'buildStaging',
    's3:staging',
    's3:stagingCached'
  ]);

  grunt.registerTask('deployProduction', [
    'buildProduction',
    's3:production',
    's3:productionCached',
    'release'
  ]);

};