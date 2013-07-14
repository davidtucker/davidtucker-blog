var $ = require('jquery');
var Modernizr = require('./vendor/modernizr/custom.modernizr');

console.dir(Modernizr);

var determineIfBrowserIsSupported = function() {
	if (!Modernizr.svg) {
		$.get('/partials/browserWarning.tpl', function(data) {
			$('body').prepend(data);
		});
	}
};

var preventDeepLinkingErrors = function() {
	// Hide address bar on mobile devices
	// (except if #hash present, so we don't mess up deep linking).
	if (Modernizr.touch && !window.location.hash) {
		$(window).load(function() {
			setTimeout(function() {
				window.scrollTo(0, 1);
			}, 0);
		});
	}
};


$(function() {
	determineIfBrowserIsSupported();
	preventDeepLinkingErrors();
});