var $ = require('jquery');

WebFontConfig = {
  google: { families: [ 'Roboto:400,100,900:latin',
                        'Roboto+Condensed:700:latin',
                        'Cardo:400,400italic,700:latin' ] }
};

var isMac = function() {
  return (navigator.userAgent.match(/(iPad|iPhone|iPod|Mac)/i)) ? true : false;
};

// Conditional Web Font Loading (Web Fonts only used on Win)
if(!isMac()) {
  $('html').addClass('win-fonts');
  var wf = document.createElement('script');
  wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
    '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
} else {
  $('html').addClass('mac-fonts');
}