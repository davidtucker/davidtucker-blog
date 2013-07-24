var $ = require('jquery');

var location = "";
var pageTitle = "";
var imageURL = "";
var description = "";
var tokens = {};

var populateSemanticInformation = function() {
  location = $("link[rel=canonical]").attr("href");
  pageTitle = $("meta[property=og\\:title]").attr("content");
  imageURL = $("meta[property=og\\:image]").attr("content");
  description = $("meta[property=og\\:description]").attr("content");
  tokens = {
    "{title}": pageTitle,
    "{url}": location,
    "{subjectPrefix}": "[DavidTucker.net]",
    "{description}": description,
    "{imageURL}": imageURL,
    "{twitterAccount}": "@mindmillmedia",
    "{twitterAttribution}": "by @mindmillmedia"
  };
};

var openPage = function(url, windowName, options) {
  windowName = windowName || "_blank";
  var openPopup = function() {
    window.open(url, windowName, options);
  };
  if (/Firefox/.test(navigator.userAgent)) {
    setTimeout(openPopup, 0);
  } else {
    openPopup();
  }
};

var tokenReplaceForURL = function(url, altTokens) {
  var output = url.replace(/\{(.+?)\}/g, function(token, match, number, txt) {
    if (!tokens[token] && altTokens) {
      return encodeURIComponent(altTokens[token]);
    }
    return encodeURIComponent(tokens[token]);
  });
  return output;
};

var facebookClick = function() {
  var otherTokens = {
    "{appId}": "502050259845747",
    "{redirect_url}": "http://www.davidtucker.net"
  };
  var url = tokenReplaceForURL("https://www.facebook.com/dialog/feed?app_id={appId}&link={url}&picture={imageURL}&name={title}&description={description}&redirect_uri={redirect_url}", otherTokens);
  var options = "width=1000,height=500,toolbar=0,location=0,status=0,scrollbars=yes";
  openPage(url, "FacebookShare", options);
};

var emailClick = function() {
  var url = tokenReplaceForURL("mailto:?subject={subjectPrefix}%20{title}&body={title}%0D%0A%0D%0A{description}%0D%0A%0D%0A{url}");
  window.location.href = url;
};

var linkedInClick = function() {
  var url = tokenReplaceForURL("http://www.linkedin.com/shareArticle?mini=true&ro=false&trk=bookmarklet&title={title}&url={url}");
  var options = "width=520,height=570,toolbar=0,location=0,status=0,scrollbars=yes";
  openPage(url, "LinkedInShare", options);
};

var twitterClick = function() {
  var url = tokenReplaceForURL("https://twitter.com/share?url={url}&text={title}%20{twitterAttribution}");
  openPage(url, "TwitterShare", "height=325,width=500");
};

var googlePlusClick = function() {
  var url = tokenReplaceForURL("https://plus.google.com/share?url={url}");
  var options = "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600";
  openPage(url, "GooglePlusShare", options);
};

var appNetClick = function() {
  var url = tokenReplaceForURL("https://alpha.app.net/intent/post?text={title}%20via%20%40davidtucker%20-%20{url}");
  var options = "width=750,height=350,left=100,top=100";
  openPage(url, "AppNetShare", options);
};

var discussClick = function(eventObj) {
  var tweet_id = $(eventObj.currentTarget).data('tweet');
  var url = "";
  if (tweet_id && tweet_id !== "") {
    url = "https://twitter.com/intent/tweet?in_reply_to=" + tweet_id;
  } else { 
    url = tokenReplaceForURL("https://twitter.com/share?url={url}&text={twitterAccount}%20");
  }
  openPage(url, "TwitterDiscuss", "height=325,width=500");
};

var twitterFollowClick = function() {
  var url = "https://twitter.com/intent/user?screen_name=mindmillmedia";
  openPage(url, "TwitterFollow", "height=535,width=500");
};

var twitterTweetClick = function() {
  var tweetid = $(this).data('tweetid');
  var url = "https://twitter.com/intent/retweet?tweet_id=" + tweetid;
  openPage(url, "TwitterFollow", "height=495,width=500");
};

$(function() {
  populateSemanticInformation();
  $('.facebook').click(facebookClick);
  $('.email').click(emailClick);
  $('.linkedin').click(linkedInClick);
  $('.twitter').click(twitterClick);
  $('.googleplus').click(googlePlusClick);
  $('.appnet').click(appNetClick);
  $('.discuss').click(discussClick);
  $(".twitter-follow").click(twitterFollowClick);
  $(".twitter-tweet").click(twitterTweetClick);
});