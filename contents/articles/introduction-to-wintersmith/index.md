---
title: An Introduction to the Wintersmith Process
subtitle: This is Part 2 of a series of posts on how I went about developing my new site and the technology, reasoning, and lessons behind it
short_description: In the last post, [The Need for a Static Site Generator](/articles/move-to-static-site-generator/), I outlined the process I went through to determine why I needed a static site generator and then my criteria for choosing one.  In this post, I want to outline basic steps for getting started with Wintersmith, review the templating engine I chose, and analyze the process for authoring content with Markdown.
author: David Tucker
date: July 26, 2013
template: post.html
keywords: wintersmith,static site,nodejs,nunjucks,markdown
---

In the last post, [The Need for a Static Site Generator](/articles/move-to-static-site-generator/), I outlined the process I went through to determine why I needed a static site generator and then my criteria for choosing one.  In this post, I want to outline basic steps for getting started with Wintersmith, review the templating engine I chose, and analyze the process for authoring content with Markdown.

## Getting Started with Wintersmith

The best way to get started with Wintersmith is to just jump into the examples.  With the current release (as of writing this article the repository is at <a href="https://github.com/jnordberg/wintersmith/commit/e888116b3182fde973ea6605f1d3eb238af95533" target="_blank">this commit</a>), there are several great examples you can try out.  Since this entire series is about my personal blog, you can use the blog example initially.  

I would recommend downloading the current release (which is currently 2.0.5).  You can see a <a href="https://github.com/jnordberg/wintersmith/releases" target="_blank">list of the current releases here</a>.  You will install Wintersmith later via npm, so downloading

### Installation

Getting Wintersmith installed is fairly easy when using npm.  You simply need to type the following:

```
npm install wintersmith -g
```

If this command fails, you may need to add `sudo` before this command on the same line.  This is dictated by how npm was installed on your machine initially.

This command will install Wintersmith globally on your machine.  You can now utilize the command line utility to create a new Wintersmith site, build a site that has been created, or preview the site using the included preview server.

> Yes, <b>Wintersmith does install globally</b>.  In addition, it doesn't have the separation between the cli module and the actual core module (as you might have noticed in projects like <a href="https://github.com/gruntjs/grunt" target="_blank">grunt</a>).  This means that you will need to use the same version of Wintersmith for all of the projects on your machine (or switch versions manually).  While this is a bit of a limitation, I do think it is a small one that I can live with.


### Preview Server

Once you have Wintersmith installed, you can run the examples that come with the source.

``` 
wintersmith preview
```

### Building the Example Site

Test

```
wintersmith build
```

### Creating a New Site

Test

```
wintersmith new <project_name>
```

## Templating

I was extremely picky about templating when going into this.  As mentioned before, I've seen templates done right (I think Expression Engine did this fairly well) and wrong (Wordpress templates violate several different development best practices).  I wanted to find a templating solution that was elegant, minimized needless duplication, and utilized actual HTML (and not some sort of abstraction).

I ended up settling on Nunjucks (which is a JavaScript port of the jinja2 templating engine in python).  Nunjucks supports template inheritance which helps to avoid the needless duplication I mentioned previously.  It also is done in HTML and uses a custom tag syntax for the items generated from the template.  At a glance, it is very easy to determine what is static HTML and what will be inserted by the template engine.  I have found that this approach requires the least amount of effort when transitioning from a mocked up HTML page to being integrated with the static site generator.

Here is the sample template I use for the listing of blog posts:

<script src="https://gist.github.com/davidtucker/6090668.js"></script>

From this there are a few important things to point out:

* The first line shows how the inheritance works.  This template extends the core layout template: `{% extends "layout.html" %}`.
* The layout template includes blocks which the sub-templates can define content for.  As an example, I have a block for the page title.  I can populate that with the following statement in the sub-template: `{% block title %}{{ page.title }}{% endblock %}`.  I also have blocks for the canonical URL and the core content of the page.
* There is also a block called meta which uses the `{{ super() }}` directive.  This tells the sub-template to append the information to what the parent template had defined for this block.  In this case, it appends a meta tag in the header.
* Just like any other mature templating solutions, Nunjucks allows for looping over content.  In this case, I am looping over each of the blog posts using this directive: `{% for article in articles %}`.

With this elegant and efficient templating solution, I was able to quickly move from an initial HTML version into Wintersmith with a minimal level of effort.  This was by far a better solution than what I saw from the other options that were available.

> You can see all of the templates I use for my site in the <a href="https://github.com/davidtucker/davidtucker-blog/tree/develop/templates" target="_blank">templates directory</a> of the Github project.


## Content Authoring

For content authoring, I wanted an experience that was as efficient as possible.  Based off of my experience, I knew I wanted to utilize <a href="http://daringfireball.net/projects/markdown/" target="_blank">Markdown</a>.  This provides both ease of use but also nearly unlimited flexibility (since it can include HTML as well.)  

After looking around, I settled on using Mou as my Markdown editor of choice for the initial content authoring.  This tool isn't perfect for Wintersmith especially in relation to the metadata section at the top of each markdown page.  However, for a quick quality editing tool this worked well.  

I am currently investigating how to improve this process and how to create a solution that integrates with Wintersmith as easily as possible.

Here is a sample markdown Wintersmith content file for my About page:

<script src="https://gist.github.com/davidtucker/6091783.js"></script>

---
## Related Articles

* Part 1 - [The Need for a Static Site Generator](/articles/move-to-static-site-generator/)
* Part 2 - An Introduction to the Wintersmith Static Site Generator

