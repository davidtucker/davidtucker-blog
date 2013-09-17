var shim = require('browserify-shim');

module.exports = function(grunt) {
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    cfg: {
      cache: {
        normal: {
          header: 'public,max-age=604800',
          files: 'build/**/*.{css,js,jpg,png}'
        },
        extended: {
          header: 'public,max-age=194400000',
          files: 'build/**/*.ico'
        },
        uncached: {
          files: 'build/**/*.{html,txt,xml,svg}'
        }
      },
      compass: {
        environment: 'development',
      },
      deploy: {
        bucket: 'livestaging.davidtucker.net'
      },
      wintersmith: {
        config: 'config-staging.json'
      }
    },
    clean: {
      build: [
        'build'
      ]
    },
    compass: {
      compile: {
        options: {
          sassDir: 'work/sass',
          cssDir: 'contents/css',
          environment: '<%= cfg.compass.environment %>',
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
      remote: {
        options: {
          config: '<%= cfg.wintersmith.config %>'
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
          'compass:compile'
        ]
      }
    },
    lineremover: {
      htmlAndXML: {
        files: [
          {
            expand: true,
            cwd: 'build/',
            src: ['**/*.{html,xml}'],
            dest: 'build/'
          }
        ]
      }
    },
    s3: {
      options: {
        key: process.env.AWS_ACCESS_KEY_ID,
        secret: process.env.AWS_SECRET_ACCESS_KEY,
        access: 'public-read',
        bucket: '<%= cfg.deploy.bucket %>'
      },
      uncached: {
        upload: [
          {
            src: '<%= cfg.cache.uncached.files %>',
            dest: '/',
            rel: 'build'
          }
        ]
      },
      normalCache: {
        options: {
          headers: {
            'Cache-Control': '<%= cfg.cache.normal.header %>'
          }
        },
        upload: [
          {
            src: '<%= cfg.cache.normal.files %>',
            dest: '/',
            rel: 'build'
          }
        ]
      },
      extendedCache: {
        options: {
          headers: {
            'Cache-Control': '<%= cfg.cache.extended.header %>'
          }
        },
        upload: [
          {
            src: '<%= cfg.cache.extended.files %>',
            dest: '/',
            rel: 'build'
          }
        ]
      }
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

  // Grunt Custom Tasks

  grunt.registerTask('defineEnvironment', 'A task to set config values per environment', function(environment) {
    if(environment == "production") {
      grunt.config.set('cfg.deploy.bucket', 'davidtucker.net');
      grunt.config.set('cfg.compass.environment', 'production');
      grunt.config.set('cfg.wintersmith.config', 'config-production.json');
    } else {
      grunt.config.set('cfg.deploy.bucket', 'livestaging.davidtucker.net');
      grunt.config.set('cfg.compass.environment', 'development');
      grunt.config.set('cfg.wintersmith.config', 'config-staging.json');
    }
  });

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
    'compass'
  ]);

  grunt.registerTask('postbuild', [
    'lineremover',
    'imagemin:dist',
    'uglify:production',
    'cacheBust',
    'cssmin:production'
  ]);

  grunt.registerTask('buildStaging', [
    'defineEnvironment:staging',
    'prebuild',
    'wintersmith:remote',
    'postbuild'
  ]);

  grunt.registerTask('buildProduction', [
    'defineEnvironment:production',
    'prebuild',
    'wintersmith:remote',
    'postbuild'
  ]);

  grunt.registerTask('deployStaging', [
    'buildStaging',
    's3'
  ]);

  grunt.registerTask('deployProduction', [
    'buildProduction',
    's3',
    'release'
  ]);

};