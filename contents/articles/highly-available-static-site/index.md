title: Creating a Highly Available Static Site
subtitle: Leveraging multiple cloud infrastructures to prevent a single point of failure for web content delivery
short_description: With a move to static sites, many individuals and organizations are enjoying the scalability of cloud based hosting solutions such as Amazon S3 and Rackspace Cloud Files for their web content.  However, in the event of an outage your site goes down completely.  By leveraging these services together along with an external DNS host, you can create a site that barely skips a beat when one of the cloud providers goes down.
author: David Tucker
date: January 31, 2013
template: post.html
keywords: amazon s3, s3, rackspace cloud files, ha, high availability, static site
tweet_id: 
feature_image: 

When I began thinking about how I would host my personal website once I moved to a static site, I knew I would be leveraging a cloud-based solutions.  Because of my experience with Amazon Web Services, I assumed that I would probably lean towards S3 as an option.  To be honest, I knew that for me if Amazon S3 goes down for a period of time, it wouldn't affect me a great deal.  If my site is down for a day, it really isn't a big deal to me.  However, for many of the clients that I work for at Universal Mind, I knew that wasn't the case.  I wanted to investigate the best way for organizations to leverage the benefits of static content and embrace high-availability which is so much easier to attain with it.

## The Cloud Options

First, it is worth taking a look at the options that are provided for hosting static content.  The two most common solutions (that exist on completely separate cloud infrastructures) are: Amazon S3 and Rackspace CloudFiles.  Both have expanded their functionality in the last 12 months to truly become viable options for web hosting of static content.

## Cooperation

The cloud options are only one piece of the puzzle.  There is another key element that must be put into place.  Lets discuss a series of events that must take place for this architecture to work as expected:

### Normal Usage

Let's examine the process of what happens when a user (User A) attempts to go to your site under normal conditions:

1.  User A enters your URL in their web browser.
2.  User A gets your DNS record which has a CNAME record pointing to your primary cloud provider.
3.  The primary cloud provider serves up the site which is then presented in User A's browser.

For this to work in an outage, we need something magical to happen.  When the user requests the site, something needs to know that the primary cloud provider is down and send the user to the secondary cloud provider.  We can't rely on any type of redirect from the primary cloud provider. At this point it is down completely.  Instead, we can look to the DNS server to help us here.

## External DNS Host

Many

Amazon does provide a DNS server as a part of Amazon Web Services: Amazon 53.  This service is a great DNS service, but relative to other services it is still new.  Some functionality that is provided by other external DNS services is not provided yet by Amazon 53.  For example, my DNS Host: DNS Made Easy supports failover for records (many other DNS hosts do the same).  Amazon does not provide this functionality at the time of this article, but it is <a href="https://forums.aws.amazon.com/thread.jspa?messageID=414275" target="_blank">on their roadmap</a>.

> I am a paying customer of DNS Made Easy, but I am not associated with the company in any way beyond that.

So - for this to work....

## Conclusion

The great thing about this configuration is that if you can add it to your workflow, you gain the power of two global cloud infrastructures for your website.  In addition, since both solutions are <i>pay for what you use</i> you don't incur huge charges for just hosting your static content (your secondard cloud platform will only charge for the actual space consumed since it will not be receiving any hits).  This combination of services provides a great solution for anyone who needs their static content to be up with extremely minimal downtime.