---
title: Automating The Development, Build, and Deployment Process with Grunt
subtitle: This is Part 3 of a series of posts on how I went about developing my new site and the technology, reasoning, and lessons behind it.  See <a href="#seriesListing">entire series listing</a>.
short_description: In t
author: David Tucker
date: August 7, 2013
template: post.html
keywords: grunt,static site,nodejs,gruntjs
---

In the last post, [An Introduction to the Wintersmith Process](/articles/introduction-to-wintersmith/), I walked through how to work with Wintersmith to create a site, preview a site that is in development, and build the site for deployment.  In addition, I walked through why I chose the nunjucks templating engine, aand why I chose to author my content in Markdown.  Today I will be walking through how I automated everything utilizing <a href="http://gruntjs.com/" target="_blank">Grunt</a>.

## What is Grunt

<a href="http://gruntjs.com/" target="_blank">Grunt</a> is defined as a JavaScript task runner.  It is powered by NodeJS (which means that is can run on any platform which can run NodeJS).  Grunt could be compared to Ant, Maven, or Gradle, but it has some efficienes that make it my automation tool of choice for projects like this.  I like to think of Grunt as a workflow tool.  In reality, you can take most any wokflow that you can imagine and make it possible through Grunt.

Grunt works by executing tasks.  These tasks could be anything.  For example, there are pre-defined tasks like CSS minification, SASS/Less compilation, file concatenation, and many others.  In addition, you have the ability to write your own tasks which accomplish anything you would like.

In my case, this workflow is entirely around developing, building, and deploying my static site.  Grunt is particulaly well suited for this task.

## A Bit of History

When I initially got started on my new static site, Grunt 0.3 was out, and id didn't meet all of my needs.  Instead, I wrote a custom bash script to handle building, previewing, and deploying.  In all honesty, it worked well.  However, I quickly realized that I was going to have to do a lot of work to integrate new features that I wanted to include (such as browserify, uglifyjs, cssmin, etc...).  

It wasn't too long after I initially investigated Grunt that Grunt 0.4 was released.  This change meant that it was a viable solution for what I wanted to do.  I quickly decided to drop the bash script and start from scratch with Grunt.  I did this for a few key reasons:

* The build process is cross-platform.  While this isn't a big issue for my personal site (as I use a Mac), I knew that a cross-platform build process would be important for other projects that I will do both for myself and for clients.
* There are many tasks for Grunt that have already been developed.  This meant a lot less work to integrate with common things like minification, copying to a server, etc...
* There is an API exposed by Grunt to create custom tasks.  This was key.  This meant that if a task didn't currently exist, I could write it.

<font color="#FF0000">ADD MORE STUFF HERE</font>

## Getting Started with Grunt

If you have NodeJS installed, it is relatively easy to install Grunt (if you do not, you can <a href="http://nodejs.org/" target="_blank">get NodeJS here</a>).  You need to perform the following steps on the command line:

```
npm install -g grunt-cli
cd <yourProjectDir>
npm install grunt --save-dev
```

This will do two key things:

1. It will install the grunt command line module globally.  This means that after you install it, you can open your command line prompt and type `grunt --version` and it should output your current command line module version and the current version of grunt for that project (if you are in a project directory).
2. It will install the grunt module locally in that directory.  Also, by using `--save-dev`, it will add grunt to the list of development dependencies in your `package.json` file.

## Automating My Static Site

fdsaf

### Clean

<b>Workflow Step:</b> I need to delete the contents of the build directory before I initiate a new build process.

I am purposefully starting with a workflow step that is very simple.  To accomplish step, I used the `grunt-contrib-clean` task (all tasks that start with `grunt-contrib` are maintained by the core grunt team).  

To install this task, you can simply use npm (as will be the case for all of the tasks I am utilizing today).  In addition, all of the tasks will be development dependencies so I will be using the `--save-dev` option.

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
  grunt.loadNpmTasks('grunt-contrib-compass');
};
```
### Browserify

ADD SOMETHING

### Image Minification

ADD SOMETHING

### Wintersmith

ADD SOMETHING

### Removing Empty Lines in Generated Files

ADD SOMETHING

### Watch Files for Changes

ADD SOMETHING

### Uglify

ADD SOMETHING

### Line Remover

ADD SOMETHING

### Cache Busting

ADD SOMETHING

### CSS Minification

ADD SOMETHING

### Deployment

The next post in this series is almost entirely

## How I Work on a Daily Basis

Test, Test

## Conclusion

With .

---
<a name="seriesListing"></a>
## Article Series

* Part 1 - [The Need for a Static Site Generator](/articles/move-to-static-site-generator/)
* Part 2 - [An Introduction to the Wintersmith Process](/articles/introduction-to-wintersmith/)
* Part 3 - [Automating The Development, Build, and Deployment Process with Grunt](/articles/automating-with-grunt/)
* More posts coming soon

