title: Introducing the ST2 Power Tools
subtitle: A solution for starting Sencha Touch 2 projects without all of the annoyances
short_description: The iPad table project from Universal Mind is an example of where multi-device communication will go in the future.  It utilizes 15 iPads that know how to talk to one another in a way that creates one seamless experience.  In this article, David Tucker, Director of Research and Development for Technology at Universal Mind walks through its development.
author: David Tucker
date: February 14, 2012
template: post.html
keywords: ios,ipad,ipad table,universal mind,research
tweet_id: 291302742520123392
feature_image: featured.jpg

I’ve spent the last few weeks working with Sencha Touch 2 alongside my traditional iOS development.  I’ll have a lot to share coming up about Sencha Touch, but that will be in separate blog posts.  I did notice however, that there were some ways that developers could become more productive when working with SDK.  This led to the creation of a new open source project: ST2 Power Tools.

This open source project is designed solely to make a developer more productive when building Sencha Touch 2 applications.  Initially it tackles two of the biggest productivity gaps when building Sencha Touch applications: project generation, and templates for commonly used classes within Sencha Touch.

> If you want to see the tools in action,  visit Create a Complete Sencha Touch 2 Application in Just Minutes.  In this demo I walk the viewer through the process of creating a complete Sencha Touch 2 application with the ST2 Power Tools in just 5 minutes.

## Prerequisites
Before we get too deep into the functionality, I should mention that my post on setting up your Mac for Sencha Touch 2 development is a prerequisite for all of the steps here.  The tools are flexible enough to work with different configurations (if you chose to setup your machine in a different manner than I did), but it will be easier if you follow the steps I provided.

## Installation
For complete installation instructions, please visit the ST2 Power Tools Github page.  I’ve already begun working on a solution that will make installation even easier in future releases.

## Functionality
The ST2 Power Tools project provides two key areas of functionality.  First, the project generator takes the pain out of generating a base project (including compass and sass setup).  Second, the live templates take the pain (and potential errors) out of generating the base code for normal Sencha Touch 2 views, models, controllers, and stores.

### Project Generation
The project generation tool is a BASH script (currently Mac only - but it may work in Windows with Cygwin) that generates a sample Sencha Touch 2 project.  The script should work equally well if you run it in the Terminal or if you run it within your IDE of choice. 

> The ST Power Tools 2 Project Generator is currently Mac Only.  While some aspects of the functionality may work in Windows under Cygwin, some aspects will certainly not work.  I may consider rewriting some aspects of the script to work specifically for Windows if there is interest.

If you follow the installation instructions, you should be able to type the following command to get the generator up and running:

	generateSenchaTouch2Project.sh

The script will guide you through the rest.  You should be prepared to answer the following questions:

1. Name of Your Application
2. Namespace for Your Application
3. Relative Path to your SDK (which if you followed the setup tutorial should be `../../sdk`

If you want to see a complete interaction with the generator, you can view the demo video or you can view a Gist which contains the command line interaction in that demo.

The templates can be modified to fit your needs.  You can read instructions on how to do this on the ST2 Power Tools page.

### Live Templates
The Live Templates functionality allows you to quickly create default elements within your Sencha Touch 2 project.

> The current version of the Live Templates supports the JetBrains family of IDE’s (WebStorm, PHPStorm, and IntelliJ).

You can read how to install and trigger these live templates on the ST2 Power Tools page.  I also recently recorded a tutorial on Working with Live Templates in PHPStorm and WebStorm.

## Conclusion
All of the code for the ST2 Power Tools can be found, forked, and downloaded from Github.