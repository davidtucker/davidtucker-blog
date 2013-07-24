var $ = require('jquery');

$(function() {

	$(window).resize(function() {
		resizePlayButtons();
	});

	$('.youtube-loader').each(function(idx) {
		var youtubeid = $(this).data('youtubeid');
		$(this).prepend("<div class='youtube-poster'></div><div class='playButton'></div>");
		var playButtonDiv = $(this).children('.playButton');
		var posterDiv = $(this).children('.youtube-poster');
		var posterImgSource = $(this).data('poster');
		var posterToLoad = (posterImgSource) ? posterImgSource : "http://img.youtube.com/vi/" + youtubeid + "/maxresdefault.jpg";
		var posterImg = new Image();
		$(posterImg).load(function() {
			posterDiv.append(posterImg);
			var playBtnImage = new Image();
			playBtnImage.height = $(posterImg).height() * 0.55;
			playBtnImage.width = playBtnImage.height;
			$(playBtnImage).load(function() {
				playButtonDiv.append(playBtnImage);
				playButtonDiv.css('position', 'absolute');
				playButtonDiv.addClass('play-icon');
				playButtonDiv.data('youtubeid', youtubeid);
				resizePlayButtons();
			}).attr("src", "/images/playButton.png");
		}).attr("src", posterToLoad);
	});

	$('.playButton').click(function(eventObj) {
		var loaderDiv = $(eventObj.currentTarget).parent();
		var youtubeid = $(this).data('youtubeid');
		var htmlToAdd = '<div class="flex-video"><iframe width="560" height="315" src="http://www.youtube.com/embed/' + youtubeid + '?autoplay=1" frameborder="0" allowfullscreen></iframe></div>';
		loaderDiv.replaceWith(htmlToAdd);
	});

});

var resizePlayButtons = function() {
	$('.playButton img').each(function(idx) {
		var playButtonDiv = $(this).parent();
		var poster = $(this).parent().siblings('.youtube-poster').children('img');
		$(this).height(poster.height() * 0.55);
		$(this).width($(this).height());
		var top = (poster.height() / 2) - ($(this).height() / 2);
		var left = (poster.width() / 2) - ($(this).width() / 2);
		playButtonDiv.css('top', top);
		playButtonDiv.css('left', left);
	});
};