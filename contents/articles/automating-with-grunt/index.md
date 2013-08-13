---
title: Automating The Development, Build, and Deployment Process with Grunt
subtitle: This is Part 3 of a series of articles on how I went about developing my new site and the technology, reasoning, and lessons behind it.  See <a href="#seriesListing">entire series listing</a>.
short_description: In the last post, An Introduction to the Wintersmith Process, I walked through how to work with Wintersmith to create a site, preview a site that is in development, and build the site for deployment.  In addition, I walked through why I chose the nunjucks templating engine, and why I chose to author my content in Markdown.  Today I will be walking through how I automated everything utilizing Grunt.
author: David Tucker
date: August 12, 2013
template: post.html
keywords: grunt,static site,nodejs,gruntjs
---

In the last post, [An Introduction to the Wintersmith Process](/articles/introduction-to-wintersmith/), I walked through how to work with Wintersmith to create a site, preview a site that is in development, and build the site for deployment.  In addition, I walked through why I chose the nunjucks templating engine, and why I chose to author my content in Markdown.  Today I will be walking through how I automated everything utilizing <a href="http://gruntjs.com/" target="_blank">Grunt</a>.

This post has multiple parts.  First, I start with [giving an introduction](#introduction) to what Grunt is, why I decided to use it, and how to get started.  Next, I [talk about the workflow](#workflow) I needed to create with Grunt and how I work with it on a daily basis.  Finally, I have included an [exhaustive reference of my Gruntfile](#gruntfileReference) and how each task works.

<a name="introduction"></a>
## What is Grunt

<a href="http://gruntjs.com/" target="_blank">Grunt</a> is defined as a JavaScript task runner.  It is powered by <a href="http://nodejs.org/" target="_blank">NodeJS</a> (which means that it can run on any platform which can run NodeJS).  Grunt could be compared to Ant, Maven, or Gradle, but it has some efficiencies that make it my automation tool of choice for projects like this.  I like to think of Grunt as a workflow tool.  In reality, you can take most any workflow that you can imagine and make it possible through Grunt.

Grunt works by executing tasks.  These tasks could be anything.  For example, there are pre-defined tasks like CSS minification, SASS/Less compilation, file concatenation, and many others.  In addition, you have the ability to write your own tasks which accomplish anything you would like.

In my case, this workflow is entirely around developing, building, and deploying my static site.  Grunt is particularly well suited for this task.

## A Bit of History

When I initially got started on my new static site, Grunt 0.3 was out, and it didn't meet all of my needs.  Instead, I wrote a custom bash script to handle building, previewing, and deploying.  In all honesty, it worked well.  However, I quickly realized that I was going to have to do a lot of work to integrate new features that I wanted to include (such as browserify, uglifyjs, cssmin, etc...).  

After Grunt 0.4 was released, I quickly decided to drop the bash script and start from scratch with Grunt.  I did this for a few key reasons:

* There are many tasks for Grunt that have already been developed.  This meant a lot less work to integrate with common things like minification, copying to a server, etc...
* There is an API exposed by Grunt to create custom tasks.  This was key.  This meant that if a task didn't currently exist, I could write it.
* There is a very active community both supporting the core project as well as creating third-party tasks.  This meant less work for me each time I wanted to implement a new workflow step.  Chances are, someone else had already solved that step.
* The build process is cross-platform.  While this isn't a big issue for my personal site (as I use a Mac), I knew that a cross-platform build process would be important for other projects that I will do both for myself and for clients.

## Getting Started with Grunt

If you have NodeJS installed, it is relatively easy to install Grunt (if you do not, you can <a href="http://nodejs.org/" target="_blank">get NodeJS here</a>).  You need to perform the following steps on the command line:

```
npm install -g grunt-cli
cd <yourProjectDir>
npm install grunt --save-dev
```

This will do two key things:

1. It will install the Grunt command line module globally.  This means that after you install it, you can open your command line prompt and type `grunt --version` and it should output your current command line module version and the current version of Grunt for that project (if you are in a project directory).
2. It will install the Grunt module locally in that directory.  Also, by using `--save-dev`, it will add Grunt to the list of development dependencies in your `package.json` file.

### The Gruntfile

Every Grunt project has a file, `Gruntfile.js` which defines the workflow for Grunt to execute.  Within this file, the workflow is configured with all of the needed options, and then Grunt can execute single or multiple workflow steps from the command line.

For example, let's say that you wanted to minify the CSS files in your `css/` directory.  To accomplish this, you would use a Grunt task called `grunt-contrib-cssmin`.  First, you would need to install this task.  This is simple using npm:

```
npm install grunt-contrib-cssmin --save-dev
```

Next, you can add this workflow step into your Gruntfile.  There is some boilerplate code that is included with each Gruntfile.  You will generally start with something like this:

```
module.exports = function(grunt) {
  grunt.initConfig({
	
  });
};
```

Within the `grunt.initConfig` function, you will add an object which holds all of the tasks that you want to execute and the configuration options on each one.  To add in our CSS minification, we will add in the following:

```
module.exports = function(grunt) {
  grunt.initConfig({
	cssmin: {
	  production: {
	    expand: true,
	    cwd: 'css',
	    src: ['*.css'],
	    dest: 'css'
	  }
	}
  });
  grunt.loadNpmTasks('grunt-contrib-cssmin');
};
```

In this case, we have added in the `cssmin` <b>task</b>.  Within that task, we have created a <b>target</b> called `production`.  Most of the tasks we are dealing with today are <b>multi-tasks</b> which means that they can have multiple targets each of which has its own set of configuration options.

> Any Grunt task that starts with `grunt-contrib` means that it is maintained by the Grunt core team.  These are pretty much guaranteed to always work well with the current version of Grunt.

Within the `production` target, we have several properties that dictate the files on which it should act.  Each task has its own documentation for the options that it supports, and that is generally included in the task's README file in its repository.  For example, you can read the documentation for `grunt-contrib-cssmin` <a href="https://github.com/gruntjs/grunt-contrib-cssmin" target="_blank">on Github</a>.

### Executing the Task

Once the configuration is in place, you can run this task by executing it on the command line by referencing both the task and target name (if you don't reference a target name, it will run all targets for the task).  The format generally is `grunt task:target`.  In our case, we can simply execute our target this way: 

```
grunt cssmin:production
```

When you run this task, you should get feedback as to whether your task completed successfully:

```
Running "cssmin:production" (cssmin) task
File build/css/app.css created.

Done, without errors.
```

In this case, you can see that it minified the file `app.css` and that it completed without errors.


<a name="workflow"></a>
## Automating My Static Site

For my site, I had a very specific workflow that I wanted to implement.  These workflow steps were independent of any technology.  Once I decided on Grunt, I worked to link these workflow steps with Grunt tasks that could be used to implement them.  

> With each workflow step here, I have also linked to the task in the reference below to show you how I implemented it.

1.  I need to delete the contents of the build directory before I initiate a new build process. \[[see Grunt task in reference](#workflowClean)]
2.  I need to initiate the following actions for Wintersmith: launching the preview server, building for the staging environment, and building for the production environment. \[[see Grunt task in reference](#workflowWintersmith)]
3.  I need to compile my SASS/Compass code to a standard file.  In addition, I ned to be sure that it includes the Foundation framework. \[[see Grunt task in reference](#workflowCompass)]
4.  I need to validate that my JavaScript code follows a set of best practices that I have defined and alert me if it does not meet the standards. \[[see Grunt task in reference](#workflowJSHint)]
5.  I need to utilize Browserify to manage dependencies between different logic groups of my JavaScript code using CommonJS modules and compile that to a single JavaScript file that I can load for my site. \[[see Grunt task in reference](#workflowBrowserify)]
6.  I need to minify images that are included in my static site after the site is built but before it is deployed to the host. \[[see Grunt task in reference](#workflowImagemin)]
7.  I need to remove empty lines from HTML and XML files which are generated by Wintersmith. \[[see Grunt task in reference](#workflowLineRemover)]
8.  I want to be able to automatically compile my SASS code or my JavaScript code with Browserify when any of those files in my `work` directory changes. \[[see Grunt task in reference](#workflowWatch)]
9.  I want to be able to automatically compress and minify my JavaScript when I build for staging or production environments. \[[see Grunt task in reference](#workflowUglify)]
10.  I want to be able to utilize a hash of my CSS/JS files' filename to help ensure that the viewers of my site don't end up loaded an older cached version of these files. \[[see Grunt task in reference](#workflowCache)]
11.  I want to minify all CSS files that are compiled from the SASS code before I deploy a build to the staging or production environments. \[[see Grunt task in reference](#workflowCSSmin)]
12.  I want to be able to deploy to both a staging or production environment on Amazon S3. \[[see Grunt task in reference](#workflowDeploy)]
13.  I want to be able to automatically change the version number and tag production releases in my git repository. \[[see Grunt task in reference](#workflowVersioning)]

## How I Work on a Daily Basis

One very important aspect of the workflow for me was being able to sit down at my computer and start development within a minute (or two).  I explored options for this, and the easiest way to get it working initially was using window groups with Terminal on my Mac.  I wanted to create a quick screencast to illustrate this process:

<div class="youtube-loader" data-youtubeid="NEcXJ2VNxgY"></div>

As mentioned in the screencast, I always have three tabs open in the window group for my static site development:

1.  A window which runs `grunt dev` which monitors my JavaScript and SASS files for changes
2.  A window which runs `grunt preview` to keep the Wintersmith preview server working
3.  A window which is configured to be at my project directory where I can run other tasks like `grunt deployStaging` or `grunt deployProduction`

## Conclusion

I have outlined my overall process for working with Grunt.  I can honestly say that once I switched to Grunt, I haven't looked back.  Having this structure around my overall build and deployment process has created efficiencies both in the ability to add / create new tasks, but also in keeping the build process in sync across multiple machines.

I have included an extensive reference to my Gruntfile below which outlines each task I use, the configuration behind that task, and how I wrap up my workflow into bite-size chunks which can be executed at will.

<hr>

<a name="gruntfileReference"></a>
## Grunt Reference for My Site

I have included below an extensive (and exhaustive) reference to my Gruntfile.  This reference is for the current version (as of the writing of this article) of the file which you can <a href="https://github.com/davidtucker/davidtucker-blog/blob/2ef987c643c4e811e53d33991c8567f6ef0d6e6e/Gruntfile.js" target="_blank">see here</a>.  Each task is outlined below with its configuration as well as where to find the source code for each task.

<a name="workflowClean"></a>
### Clean

<b>Workflow Step:</b> I need to delete the contents of the build directory before I initiate a new build process.

I am purposefully starting with a workflow step that is very simple.  To accomplish step, I used the `grunt-contrib-clean` task.  

To install this task, you can simply use npm.  In addition, all of the tasks in this reference will be development dependencies so I will be using the `--save-dev` option for each of them.

```
npm install grunt-contrib-clean --save-dev
```

Next, we will add this task to the `Gruntfile.js` file.  We are creating a version of this task called `build`.  This will delete the contents of the `build/` directory before we start a new build.

```
module.exports = function(grunt) {
  grunt.initConfig({
	clean: {
	  build: [
	    'build'
	  ]
	}
  });
  grunt.loadNpmTasks('grunt-contrib-clean');
};
```

Now, you can simply run this task from the command line by executing `grunt clean:build` from the command line.

<b>Source Code:</b> <a href="https://github.com/gruntjs/grunt-contrib-clean" target="_blank">https://github.com/gruntjs/grunt-contrib-clean</a>

<a name="workflowCompass"></a>
### Compass / SASS

<b>Workflow Step:</b> I need to compile my SASS/Compass code to a standard file.  In addition, I ned to be sure that it includes the Foundation framework.

As with all of the tasks, the `grunt-contrib-compass` can be installed using npm:

```
npm install grunt-contrib-compass --save-dev
```
To add this to your Gruntfile, you simply need to add the compass task.  I have added both a distribution and a development target.  In both cases, I have included the `zurb-foundation` framework with the build.

```
module.exports = function(grunt) {
  grunt.initConfig({
	...
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
	...
  });
  grunt.loadNpmTasks('grunt-contrib-compass');
};
```
You can execute this task by entering either `grunt compass:dist` or `grunt compass:dev` on the command line.

<b>Source Code:</b> <a href="https://github.com/gruntjs/grunt-contrib-compass" target="_blank">https://github.com/gruntjs/grunt-contrib-compass</a>

<a name="workflowWintersmith"></a>
### Wintersmith

<b>Workflow Step:</b> I need to initiate the following actions for Wintersmith: launching the preview server, building for the staging environment, and building for the production environment.

To solve this step, I chose `grunt-wintersmith`.  The initial version of `grunt-wintersmith` was not compatible with Grunt 0.4 and Wintersmith 2.0.  The initial project was developed by <a href="http://ajpiano.com/" target="_blank">Adam Sontag</a>, but I recently worked with Adam to take over development of the project and bring its compatibility up to the current versions of Grunt and Wintersmith.

As with the other modules, it is installed via npm.

```
npm install grunt-wintersmith --save-dev
```

To integrate this, I created three different targets for the `wintersmith` task.  The first is for the staging environment followed by the production environment and the preview server.  By default the action is `build`, so I had to specify `preview` for the target that starts the preview server.


```
module.exports = function(grunt) {
  grunt.initConfig({
	...
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
	...
  });
  grunt.loadNpmTasks('grunt-wintersmith');
};
```
You can execute this task by running `grunt wintersmith:staging`, `grunt wintersmith-production`, or `grunt wintersmith-preview` on the command line.

<b>Source Code:</b> <a href="https://github.com/davidtucker/grunt-wintersmith" target="_blank">https://github.com/davidtucker/grunt-wintersmith</a>

<a name="workflowJSHint"></a>
### JSHint

<b>Workflow Step:</b> I need to validate that my JavaScript code follows a set of best practices that I have defined and alert me if it does not meet the standards.

As with all of the tasks, the `grunt-contrib-jshint` can be installed using npm:

```
npm install grunt-contrib-jshint --save-dev
```

I have added the `jshint` task to my Gruntfile and also added a `work` target which will check both my Gruntfile as well as any JavaScript files in the root of my `work/js/` directory.  I chose to not include any vendor specific files (such as jQuery) in this target.

```
module.exports = function(grunt) {
  grunt.initConfig({
	...
	jshint: {
	  work: [
	    'work/js/*.js',
	    'Gruntfile.js' ]
	},
	...
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');
};
```

With this in place, you can run this task by executing `grunt jshint:work` on the command line.

<b>Source Code:</b> <a href="https://github.com/gruntjs/grunt-contrib-jshint" target="_blank">https://github.com/gruntjs/grunt-contrib-jshint</a>

<a name="workflowBrowserify"></a>
### Browserify

<b>Workflow Step:</b> I need to utilize Browserify to manage dependencies between different logic groups of my JavaScript code using CommonJS modules and compile that to a single JavaScript file that I can load for my site.

I am a big fan of <a href="http://browserify.org/" target="_blank">Browserify</a> over <a href="http://requirejs.org/" target="_blank">RequireJS</a> in situations where the JavaScript needs to be loaded up front.  RequireJS has its benefits if you are building a web application and need to load parts of the experience asynchronously as needed, but in my case I wanted to load all of it up front.  In addition, I am leveraging caching (more on that later in this post) so using Browserify allowed me to logically separate my JavaScript into buckets, load external resources (such as jQuery), and also manage the interdependencies of both.  

To install Browserify, I needed to pull in two different modules:

```
npm install grunt-browserify2 --save-dev
npm install browserify-shim --save-dev
```

Once that was in place, I could add the `browserify` task to my Gruntfile and include both the entry point (the root JavaScript file) as well as where it should compile the JavaScript to.  Finally, I utilize the `beforeHook` to shim jQuery so that it works properly for Browserify.

```
var shim = require('browserify-shim');

module.exports = function(grunt) {
  grunt.initConfig({
	...
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
	...
  });
  grunt.loadNpmTasks('grunt-browserify2');
};
```
To run this task, you can enter `grunt browserify2:compile` on the command line.

<b>Source Code:</b> <a href="https://github.com/shanejonas/grunt-browserify2" target="_blank">https://github.com/shanejonas/grunt-browserify2</a>

<a name="workflowImagemin"></a>
### Image Minification

<b>Workflow Step:</b> I need to minify images that are included in my static site after the site is built but before it is deployed to the host.

The `grunt-contrib-imagemin` task does exactly what my workflow step needed to have done.  To install the task, utilize npm:

```
npm install grunt-contrib-imagemin --save-dev
```

In this case, I just wanted to minify every `png` or `jpg` that is in my build folder.  As you can see below I added a `dist` target for the `imagemin` task and included a config object for both file types.  In this config object, I assigned the destination to be the same as the source.  This makes sense because this only affects the build directory (and not the source).  

In addition, I set the overall `optimizationLevel` to 3.  

```
module.exports = function(grunt) {
  grunt.initConfig({
	...
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
	...
  });
  grunt.loadNpmTasks('grunt-contrib-imagemin');
};
```
You can minify the images by simply entering `grunt imagemin:dist` on the command line.

<b>Source Code:</b> <a href="https://github.com/gruntjs/grunt-contrib-imagemin" target="_blank">https://github.com/gruntjs/grunt-contrib-imagemin</a>

<a name="workflowLineRemover"></a>
### Removing Empty Lines in Generated Files

<b>Workflow Step:</b> I need to remove empty lines from HTML and XML files which are generated by Wintersmith.

Wintersmith does a great job in static site generation, but in many cases it does leave some whitespace.  As a developer I don't mind this as long as I can remove it before I deploy.  Because of that, I wrote a small single-purpose grunt task which scans specified files and removes empty lines It actually has some other uses, but I didn't use them here.

> I will be writing a blog post very soon on creating your first grunt task, and it will utilize the `grunt-line-remover` task.

Installing the `grunt-line-remover` task can be installed via npm:

```
npm install grunt-line-remover --save-dev
```

To get this to work, I utilized the `lineremover` task and configured two file objects: one for `html` files and one for `xml` files.


```
module.exports = function(grunt) {
  grunt.initConfig({
	...
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
	...
  });
  grunt.loadNpmTasks('grunt-line-remover');
};
```

To execute this task, just run `grunt lineremover` (which will run both the `html` and `xml` targets) from the command line.

<b>Source Code:</b> <a href="https://github.com/davidtucker/grunt-line-remover" target="_blank">https://github.com/davidtucker/grunt-line-remover</a>

<a name="workflowWatch"></a>
### Watch Files for Changes

<b>Workflow Step:</b> I want to be able to automatically compile my SASS code or my JavaScript code with Browserify when any of those files in my `work` directory changes.

This workflow step was absolutely essential for me.  I needed to have both my JS and SASS files compile automatically, or I would spend a ton of time waiting on files to compile before I could preview changes.  Luckily, the Grunt core team has a solution for this as well: `grunt-contrib-watch`.

It can be installed via npm:


```
npm install grunt-contrib-watch --save-dev
```

With that in place, you need to configure what files you want to watch.  In this example below, I am watching JS files with one target and the SASS files with another target.

```
module.exports = function(grunt) {
  grunt.initConfig({
	...
	watch: {
	  js: {
	    files: [
	      'work/js/**/*.js'
	    ],
	    tasks: [
	      'jshint:work', 
	      'browserify2'
	    ]
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
	...
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
};
```

You can execute this task and watch both file types by executing `grunt watch` on the command line (it will run both the `js` and `sass` targets).

<b>Source Code:</b> <a href="https://github.com/gruntjs/grunt-contrib-watch" target="_blank">https://github.com/gruntjs/grunt-contrib-watch</a>

<a name="workflowUglify"></a>
### Uglify

<b>Workflow Step:</b> I want to be able to automatically compress and minify my JavaScript when I build for staging or production environments.

Another important step for my workflow was ensuring that my JavaScript was minified as much as it could be.  This reduces the overall file size which means that it lowers the wait time for my end users.  The Grunt core team also has a solution for this: `grunt-contrib-uglify`.

It can be installed with npm:


```
npm install grunt-contrib-uglify --save-dev
```

With the task installed, I just need to configure the file it wants as an input and then where it should output the results.


```
module.exports = function(grunt) {
  grunt.initConfig({
	...
	uglify: {
	  production: {
	    files: {
	      'build/js/app.min.js': 'build/js/app.min.js'
	    }
	  }
	},
	...
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
};
```

This task can be executed on the command line by running `grunt uglify:production`.


<b>Source Code:</b> <a href="https://github.com/gruntjs/grunt-contrib-uglify" target="_blank">https://github.com/gruntjs/grunt-contrib-uglify</a>

<a name="workflowCache"></a>
### Cache Busting

<b>Workflow Step:</b> I want to be able to utilize a hash of my CSS/JS files' filename to help ensure that the viewers of my site don't end up loaded an older cached version of these files.

When one transitions away from a traditional web host, caching becomes an even bigger deal.  If someone is using a solution like Amazon CloudFront, the chances of the user getting the wrong JS or CSS file are quite high unless you specifically put measures in place to be sure that doesn't happen.  The task `grunt-hashres` handles this for you.  It will also go and scan your files in the destination directory and if it finds any instance of the old name (without the hash designator) it will replace it with the new name (which includes has identifier).

> I've had people ask me before why I don't just use a timestamp instead of a hash of the file.  In the end it is because I want to leverage caching to its fullest.  This way, a filename that has a part of the hash in it will keep the same name until something inside of it has changed.

This task can be installed via npm:

```
npm install grunt-hashres --save-dev
```

To configure this task, you need to set a few master options.  In this case, I set the default encoding to be `utf8` and then specified a file name format.  After that, I have configured three targets: one for the CSS files, one for the JavaScript Files, and one for the images.


```
module.exports = function(grunt) {
  grunt.initConfig({
	...
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
	...
  });
  grunt.loadNpmTasks('grunt-hashres');
};
```

You can execute all of these targets by simply entering `grunt hashres` on the command line.


<b>Source Code:</b> <a href="https://github.com/Luismahou/grunt-hashres" target="_blank">https://github.com/Luismahou/grunt-hashres</a>

<a name="workflowCSSmin"></a>
### CSS Minification

<b>Workflow Step:</b> I want to minify all CSS files that are compiled from the SASS code before I deploy a build to the staging or production environments.

This step was a relatively easy one to implement.  The Grunt team provided yet another great task with `grunt-contrib-cssmin`.  

Like the others, it is installed with npm:

```
npm install grunt-contrib-cssmin --save-dev
```
For the configuration, you just point it at a directory and it will minify the files that it finds there.

```
module.exports = function(grunt) {
  grunt.initConfig({
	...
	cssmin: {
	  production: {
	    expand: true,
	    cwd: 'build/css',
	    src: ['*.css'],
	    dest: 'build/css'
	  }
	}
	...
  });
  grunt.loadNpmTasks('grunt-contrib-cssmin');
};
```

This task can now be executed by calling `grunt cssmin:production` on the command line.

<b>Source Code:</b> <a href="https://github.com/gruntjs/grunt-contrib-cssmin" target="_blank">https://github.com/gruntjs/grunt-contrib-cssmin</a>

<a name="workflowDeploy"></a>
### Deployment

<b>Workflow Step:</b> I want to be able to deploy to both a staging or production environment on Amazon S3.

The next post in this series will focus entirely on the deployment process, utilizing Amazon S3 for static sites, and also some tips and tricks for optimizations.  I will cover the grunt deployment process there.  However, I will give a brief introduction here.  This entire process is made possible by another open source task: `grunt-s3`.

As with the others, this one is installed with npm.

```
npm install grunt-s3 --save-dev
```
I will go over all of the configuration in the next post, but you can see that I have targets for both staging and production (which are in separate buckets on Amazon S3).

```
module.exports = function(grunt) {
  grunt.initConfig({
	...
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
	  }
	},
	...
  });
  grunt.loadNpmTasks('grunt-s3');
};
```
The task can be executed by calling either `grunt s3:staging` or `grunt s3:production`.

<b>Source Code:</b> <a href="https://github.com/pifantastic/grunt-s3" target="_blank">https://github.com/pifantastic/grunt-s3</a>

<a name="workflowVersioning"></a>
### Versioning

<b>Workflow Step:</b> I want to be able to automatically change the version number and tag production releases in my git repository.

One useful task is `grunt-shell` which allows you to execute shell commands from within your Gruntfile.  I utilized it here as a wrapper to call the `npm version` command which will increment the version in your `package.json` file.  

Like the other tasks, `grunt-shell` is installed via npm:

```
npm install grunt-shell --save-dev
```

In this case, I use the `patch` argument which means that it will update the third number in the version number (following semantic versioning standards).  For example, if my version was 0.0.7, it would become 0.0.8 after running this command.  In addition to updating the `package.json` file, if it is in a git repository, it will commit the change to the `package.json` file and then create a tag using the version number as the name of the tag.

```
module.exports = function(grunt) {
  grunt.initConfig({
	...
	shell: {
	  bumpVersion: {
	    command: 'npm version patch'
	  }
	},
	...
  });
  grunt.loadNpmTasks('grunt-s3');
};
```
This task can be executed by calling `grunt shell:bumpVersion`.

<b>Source Code:</b> <a href="https://github.com/sindresorhus/grunt-shell" target="_blank">https://github.com/sindresorhus/grunt-shell</a>

## Grunt Task Workflow

When I want to perform certain tasks in a specific order, I don't want to have to remember each task.  To make the development and deployment processes as easy as possible, I have registered specific tasks around the workflow steps I want them to perform (all of these tasks are registered using the `grunt.registerTask` function and can be seen below in the [Registered Task Reference](#registeredTasks)).

For example, when I want to deploy to my staging environment, I can simply type `grunt deployStaging`.  Because of  these tasks that I have registered (all can be seen below) this performs the following tasks (in order):

1. Cleans the build directory: `clean:build` which is a part of the `prebuild` task
2. Compiles the JavaScript code with browserify: `browserify2` which is a part of the `prebuild` task
3. Compiles the CSS with compass using distribution settings: `compass:dist` which is part of the `prebuild` task
4. Build the Wintersmith static site using the staging config file: `wintersmith:staging` which is part of the `buildStaging` task
5. Remove all empty lines in the generated HTML and XML files: `lineremover` (runs all targets) which is part of the `postbuild` task
6. Optimize all image files: `imagemin:dist` which is part of the `postBuild` task
7. Minify the JavaScript code: `uglify:production` which is part of the `postBuild` task
8. Perform cache busting on CSS, JS, and image files: `hashres:images`, `hashres:css`, `hashres:js` which are all a part of the `cachebust` task which is called from `postBuild` task
9. Minify CSS files: `cssmin:production` which is called from the `postBuild` task
10. Deploy the entire site to my staging environment: `s3:staging` which is called from the `deployStaging` task

<a name="registeredTasks"></a>
### Registered Task Reference

```
// Tasks that I will call from the command line - "public tasks"

grunt.registerTask('deployStaging', [
  'buildStaging',
  's3:staging'
]);

grunt.registerTask('deployProduction', [
  'buildProduction',
  's3:production',
  'release'
]);

grunt.registerTask('dev', [
  'watch'
]);

grunt.registerTask('preview', [
  'wintersmith:preview'
]);

// Tasks that are called within the "public tasks" 

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

grunt.registerTask('release', [
  'shell:bumpVersion'
]); 

grunt.registerTask('cacheBust', [
  'hashres:images',
  'hashres:css',
  'hashres:js'
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
```

---
<a name="seriesListing"></a>
## Article Series

* Part 1 - [The Need for a Static Site Generator](/articles/move-to-static-site-generator/)
* Part 2 - [An Introduction to the Wintersmith Process](/articles/introduction-to-wintersmith/)
* Part 3 - [Automating The Development, Build, and Deployment Process with Grunt](/articles/automating-with-grunt/)
* More posts coming soon

