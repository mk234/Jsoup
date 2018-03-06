var relatedHeadlines= {

	"setHeight" : function() {
		relatedHeadlines.maxHeight = $('#related-headlines').height();
		element("related-headlines").classes.add("less");
		relatedHeadlines.limitedHeight = $('#related-headlines').height();
		document.getElementById('related-headlines').style.height=relatedHeadlines.limitedHeight+"px";
	},

	"rollDown": function() {
		element("related-headlines").classes.remove("less");
		element("rh-show-more").classes.add("hid");
		var interval = setInterval(function () {
			var h = $('#related-headlines').height();
			if (h >= relatedHeadlines.maxHeight) {
				clearInterval(interval);
			}
			document.getElementById('related-headlines').style.height=Math.ceil( h+((relatedHeadlines.maxHeight-h)/2) )+"px";
		}, 30);
	},
};