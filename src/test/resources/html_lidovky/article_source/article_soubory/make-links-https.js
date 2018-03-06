try {
	if(window.location.protocol === 'https:') {
		var oldHrefs = [];
		var rx = new RegExp("^http://((([^\.]+)\.)?lidovky\.cz)");
		var whitelist = ["neviditelnypes", "ceskapozice", "vysledky"];
		[].forEach.call(document.querySelectorAll("a[href^='http:']"), function(ele) {
			var href = ele.getAttribute('href');
			var match = href.match(rx);
			if(match) {
				if(0 <= whitelist.indexOf(match[3])) {
					return;
				}
				oldHrefs.push(href);
				ele.setAttribute('data-old-href', href);
				ele.setAttribute('href', href.replace(rx, 'https://$1'));
			}
		});
		if(oldHrefs.length) {
			Log.ping(window.location.toString(), 'lcz-http-link-' + oldHrefs.join('-'));
		}
	}
} catch (e) {

}
