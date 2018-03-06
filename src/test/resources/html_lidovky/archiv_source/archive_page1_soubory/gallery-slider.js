//$(document).ready(function () {
	$.fn.GallerySlider = function (p) {
  
    if(!this.children(":not(script, noscript)").length) return;
    this.children("script, noscript").remove();

		p = $.extend({
			btnPrev: null,
			btnNext: null,
			speed: 700,
			scroll: 1
		}, p || {});
    
    var children = this.children();
    if(this.width() / children.width() + p.shift > children.length)
    {
      this.append(children.clone());
      children = this.children();
    }

		var element_count = children.length;
		var element_width = children.width();
		$(this).css('width', (element_width * element_count) + "px");
		var container = this;

		$(p.btnPrev).click(function () {
			container.css('left', -(element_width * p.shift) + "px");
			for(var i=1; i<=p.shift; i++){
				container.prepend(container.children(":last"));
			}
			container.stop().animate({ left: '+=' + element_width * p.shift + 'px' }, p.speed);
		});

		$(p.btnNext).click(function(){

			container.stop().animate({ left: '-=' + element_width * p.shift + 'px' }, p.speed, function () {

				for(var i=1; i<=p.shift; i++){ 
					container.append(container.children(":first"));
				}
				container.css('left', 0);
			});
		});
	}

//});