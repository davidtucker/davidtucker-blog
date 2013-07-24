---
title: The Need for a Static Site Generator
subtitle: This is Part 1 of a series of posts on how I went about developing my new site and the technology, reasoning, and lessons behind it
short_description: Writing has always been a part of what I do.  I've had a chance to blog for sites like Mashable, Appolicious, and InsideRIA, but my main goal has been to have a quality personal blog.  However, that hasn't always happened since the technical side kept getting in my way.  I wanted to find the best way to create a blog that required minimal maintenance of the engine and also allowed me to write content quickly and easily while also rapdily iterating on the design and structure.
author: David Tucker
date: July 24, 2013
template: post.html
keywords: html,david tucker,grunt,wintersmith,nodejs,foundation css
---

Writing has always been a part of what I do.  I've had a chance to blog for sites like <a href="http://mashable.com/" target="_blank">Mashable</a>, <a href="http://www.appolicious.com/" target="_blank">Appolicious</a>, and the <a href="http://www.adobe.com/inspire.html" target="_blank">Adobe Inspire Magazine</a>.  That being said, my primary goal has been to have a quality personal blog with fresh content that is added regularly.  However, that hasn't always happened since over blog maintenance kept getting in my way.  I wanted to find the best way to create a blog that required minimal maintenance of the engine and also allowed me to write content quickly and easily while also rapdily iterating on the design and structure.  

This led me down a path of completely redoing everything about my personal site.  In this series I will outline all of my decisions and the technologies I chose.  In this first article, I will give some background information and outline my decision process for choosing a static site generator.  

> All code for my new site is <a href="https://github.com/davidtucker/davidtucker-blog" target="_blank">available on Github</a> and is being released under an MIT License.  You can feel free to use as you see fit.

## The Backstory

To give you some insight on why I chose to utilize a static site generator, I have to give you a short history of my blogging and the platforms I have used.  Don't worry, this will be short and relatively painless.

### Wordpress

When I first put up a blog at davidtucker.net, it was powered by <a href="http://wordpress.org/" target="_blank">Wordpress</a>.  If my memory serves me correctly this was back around 2007.  Wordpress is obviously a quality blogging platform, and since I was doing PHP development at that time, it made sense.  However, a few big problems became evident over the years I used Wordpress:

* Wordpress requires maintenance.  Updates need to be installed immediately because Wordpress vulnerabilities are targeted by hackers (and often).
* Wordpress also required server maintenance.  I've generally always managed a personal Linux server, and I was managing a personal LAMP stack server on which my blog ran.  In many cases I was hacked because of a vulnerability in my server setup (I recall three hacks specifically during my early days of using Wordpress before I knew how to fully harden Apache for Wordpress use).
* Wordpress templates mix too much presentation and logic in the same code.  As I grew into a more seasoned developer, I began to realize the problems that this created.  Every time I would work on a new design for my blog, I would quickly realize the huge amount of time it took to take a completed design idea which was in HTML, CSS, and JS and make it into a workable template for Wordpress.
* Wordpress is a blogging engine with pre-defined types (yes, I realize this has changed since then).  This is fine for sites that are just blogs, but if you want it to manage other types of content or add other content properties you had to fit a square peg into a round hole.  That certainly isn't to say it could not be done, but in those earlier days of Wordpress it always felt like a bad hack to get those other properties included and referenced within the templates.

It didn't take long for me to realize that these elements were truly limiting my ability to blog regularly and to rapidly iterate on some elements within my blog's structure.  I needed to find something that fit me better.

### Expression Engine

Next, I took a much more traditional content management approach.  I had known about <a href="http://ellislab.com/expressionengine" target="_blank">Expression Engine</a> (EE) for some time, and I had tried it for some other sites I was working on.   Right out of the gate there were some big benefits:

* EE provided a true type-based content management system.  This allows me to model my own data types and have them reflected properly in my site.
* EE had a much cleaner separation between the presentation and logic layers.  It wasn't perfect, but it was miles ahead of Wordpress.  This made it very easy to iterate on my site's design and structure.

I purchased an EE license, and had it deployed relatively quickly.  For a while, my blogging increased, but then the other problems reemerged.  I still had the problem of both server maintenance as well as maintaining the Expression Engine version.  I stopped counting how many times I went to write a blog post only to discover that I needed to update a version of something or change a configuration.  This utterly destroyed my blogging productivity.

### A Better Way

It was at this point that I took note that most all of my site was static.  The only dynamic element that I was utilizing was commenting, and frankly I didn't care about commenting (and there were client side options like <a href="http://disqus.com/" target="_blank">Disqus</a> that I could leverage if I needed it).  When I finally came to this conclusion, I knew I was going to choose a static site generator and deploy it on a cloud service like <a href="http://aws.amazon.com/s3/" target="_blank">Amazon S3</a> or <a href="http://www.rackspace.com/cloud/files/" target="_blank">Rackspace CloudFiles</a>.

## Choosing a Static Site Generator

Once I realized that I needed to adopt a static site generator, I began to survey the landscape.  In my search, certain generators rose to the top like <a href="http://jekyllrb.com/" target="_blank">Jekyll</a>, <a href="http://hammerformac.com/" target="_blank">Hammer</a>, and <a href="http://middlemanapp.com/" target="_blank">Middleman</a>.  To determine the best one for me, I evaluated them based off of certain criteria:

* It needed to be using a technology I am very familiar with so that I can extend and customize as needed.  I knew that this meant that it would probably not be one of the popular generators as many of them are Ruby-based (and Ruby isn't my area of expertise).
* It needed to be open source so that I could contribute to the core project.
* It needed to provide a workflow that could be easily automated and potentially tie in well with tools for this like Grunt JS.
* It needed to be command line driven.  I wasn't interested in using an _all-in-one_ GUI approach as I felt that could limit customization.

I know several people who have chosen <a href="http://pages.github.com/" target="_blank">Github Pages</a> (which optionally can utilize Jekyll), and it obviously was an area that I checked out early on.  Since its static site generator is powered by Jekyll, I decided it was not an option (just solely because as mentioned before I don't do a ton of Ruby work).  In addition, there are some limiting factors on what you can do with Jekyll on Github Pages (since you don't really control the static generator but instead leave that to Github Pages).

With that being said, I continued to look as I felt that none of the early options really met all of my criteria.

### Wintersmith

When I researched Node JS static site generators <a href="https://github.com/jnordberg/wintersmith" target="_blank">Wintersmith</a> (created by <a href="https://github.com/jnordberg" target="_blank">Johan Nordberg</a>) quickly rose to the top.  I did some initial research, and within thirty minutes I realized it would fit my needs well.  It met my earlier criteria (for the most part) and provided a few examples that I could run with.

My main issue with the examples were that they were all done with Jade as the templating engine.  I have worked with Jade before, and I'm not a big fan of it (which I realize is a discussion for another day), however I also knew that Wintersmith had a plugin API for templating.  I assumed I could find something that would work well.  After some initial investigation I settled on <a href="http://nunjucks.jlongster.com/" target="_blank">nunjucks</a> and the <a href="https://github.com/jbuck/wintersmith-nunjucks" target="_blank">wintersmith-nunjucks</a> plugin by <a href="https://github.com/jbuck" target="_blank">John Buckley</a>.  Nunjucks is based on the <a href="http://jinja.pocoo.org/" target="_blank">jinja2</a> templating engine in python and it also had similarities to Expression Engine's templates.   In both cases it allowed for the clean separation of the presentation and logic layers.  

## Conclusion

With these elements in place, I was able to move forward to building the first version of my new site.  In the upcoming posts in this series I will outline my development process, technical choices, and even my deployment choices and process.





