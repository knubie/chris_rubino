$(document).ready(function () {

	// Query string

	function getParameterByName(name) {

    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);

    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));

	}

	// Visual effects
	$('.work-item').hover(function () {
		$(this).children('.desc').css('background-color', $(this).attr('data-color'));
	},
	function () {
		$(this).children('.desc').css('background-color', '#FFFFFF');
	});
	$('#head-right > a > img').hover(function () {
			this.src = this.src.replace('up', 'down');
	}, function () {
			this.src = this.src.replace('down', 'up');
	});



	// Filters

	$('#filter-container').hover(function () {
		$('#filter').stop().animate({
			width: 500
		}, 250, false);
	}, function () {
		$('#filter').stop().animate({
			width: 0
		}, 250, false);
	});
	$('#inner-filters > a:link').click(function () {
		var cat = '.' + $(this).attr('data-cat');
		if (cat === '.all') {
			$('.work-item').removeClass('hide-me').show();
			$('#inner-filters > a:link').css('border-bottom', 'none');
		} else {
			$('#inner-filters > a:link').css('border-bottom', 'none');
			$(this).css('border-bottom', '1px solid #424242');
			$('.work-item').addClass('hide-me');
			$(cat).removeClass('hide-me');
			$('.hide-me').hide();
			$(cat).show();
		}

	});


	// Preloading

	$('.work-lightbox > img, .work-lightbox > iframe').attr('data-src', function(){
		return $(this).attr('src');
	});
	$('.work-lightbox > img, .work-lightbox > iframe').removeAttr('src');

	$('.work-lightbox').prepend('<div class="loading"></div>');

	// Lightbox

	(function () {

		var lightboxFadeOut = function(lightBox) {
			$('#main-tinted-dark, #main-tinted-light').fadeOut();
			lightBox.fadeOut();
			slides.each(function (i) {
				var src = $(this).attr('src');
				$(this).attr('src', '');
				$(this).attr('src', src);
			});
		};

		var position = function(lightBox) {
			$('#main-tinted-light').css('width', $(window).width()-20).css('height', $(window).height()-10);
			$('#main-tinted-dark').css('width', $(window).width()-20).css('height', $(window).height()-10);
			lightBox.css('top', function() {
				return $(window).height()/2 - $(this).height()/2;
			});
			$('.work-lightbox:visible').css('left', function() {
				return $(window).width()/2 - $(this).width()/2;
			});
			$('.work-lightbox > .bottom-bar > .title:visible').css('margin-right', function() {
				return 0 -$(this).width();
			});
			$('.details:visible').css('margin-left', function() {
				return 0 - $(this).width();
			});
		};


		var initLightBox = function (lightBox, bg) {
			numSlides = lightBox.children('img, iframe').length;
			slides = lightBox.children('img, iframe');
			currSlide = 0;
			transitioning = false;

			// Inject slide count
			lightBox.find('.slide-count').text(currSlide+1+" of " + numSlides);

			// Load images
			lightBox.children('img, iframe').attr('src', function(){
				return $(this).attr('data-src');
			});

			// Display initial elements
			if (bg === 'dark') {
				$('#main-tinted-light:visible').fadeOut();
			} else {
				$('#main-tinted-dark:visible').fadeOut();
			}
			$('#main-tinted-'+bg).fadeIn();
			lightBox.fadeIn();
			slides.hide();

			lightBox.css('width', '');
			lightBox.css('height', '');
			lightBox.imagesLoaded(function () {
				slides.eq(0).show();
				lightBox.find('.loading').hide();
				position(lightBox);
			});

			lightBox.find('.left').hide();
			lightBox.find('.left-backup').show();
			lightBox.find('.right').show();
			lightBox.find('.right-backup').hide();
			if (lightBox.prev().prev().length == 0) {
				$('#prev-proj, #sep').hide();
			} else {
				$('#prev-proj').show();
			}
			if (lightBox.next().next().length == 0) {
				$('#next-proj, #sep').hide();
			} else {
				$('#next-proj').show();
			}
			if (lightBox.next().next().length !== 0 && lightBox.prev().prev().length !== 0) {
				$('#sep').show();
			}
		};

		var lightBox = $('.work-lightbox'),
				numSlides,
				slides,
				currSlide = 0,
				transitioning = false,
				projNum;

		$('#press').click(function() {
			lightBox = $('#press-box');
			initLightBox(lightBox, 'dark');
		});

		$('#shop').click(function() {
			lightBox = $('#shop-box');
			initLightBox(lightBox, 'dark');
		})

		$('.work-link').click(function() {

			// Set query string
			projNum = $(this).prevAll('.work-link').length;

			if (typeof history.pushState !== 'undefined') {
				history.pushState({}, "blah", "?project="+projNum);
			}

			// Establish context
			lightBox = $(this).next('.work-lightbox');
			initLightBox(lightBox, $(this).find('.work-item').attr('data-bg'));
			$('#proj-nav').fadeIn('fast');

		});

		lightBox.find('.details, .x').click(function () {
			lightBox.find('.desc-box').slideToggle('fast');
		});

		lightBox.find('.arrow').hover(function () {
			$(this).css({ opacity: .5 });
		}, function () {
			$(this).css({ opacity: 1 });
		});
		$('#proj-x').hover(function () {
			$(this).css({ opacity: .6 });
		}, function () {
			$(this).css({ opacity: 1 });
		});

		lightBox.find('.arrow').click(function () {

			// Get arrow direction
			var dir = $(this).attr('data-dir');

			if (transitioning === true || (currSlide+1 === numSlides && dir === 'right') || (currSlide === 0 && dir === 'left')) {
				return;
			} else {

				// Start transition
				transitioning = true;
				slides.eq(currSlide).animate({opacity: 0}, 'fast', function () {

					// Pause vimeo video
					var src = $(this).attr('src');
					$(this).attr('src', '');
					$(this).attr('src', src);

					$(this).hide().css({ opacity: 1 });

					// Fix lightbox dimension after image is hidden
					lightBox.css('width', slides.eq(currSlide).width());
					lightBox.find('.stretcher').css('height', slides.eq(currSlide).height()).show();
					// lightBox.css('height', slides.eq(currSlide).height()+30);

					(dir === 'right') ? currSlide++ : currSlide--;
					if (currSlide+1 === numSlides) {
						lightBox.find('.right').hide();
						lightBox.find('.right-backup').show();
					} else {
						lightBox.find('.right').show();
						lightBox.find('.right-backup').hide();
					}
					if (currSlide === 0) { 
						lightBox.find('.left').hide();
						lightBox.find('.left-backup').show();
					} else {
						lightBox.find('.left').show();
						lightBox.find('.left-backup').hide();
					}
					lightBox.find('.slide-count').text(currSlide+1+" of " + numSlides);

					lightBox.find('.stretcher').animate({
						height: slides.eq(currSlide).height()
					}, { duration: 500 });
					lightBox.animate({
						width:  	 slides.eq(currSlide).width(),
						// Add 30 to height for bottom navbar
						top: 			 $(window).height()/2 - (slides.eq(currSlide).height() + 30) / 2,
						left: 		 $(window).width()/2 - slides.eq(currSlide).width()/2
					}, {
						step: 		 function () {},
						duration:  500,
						complete:  function () { 
							lightBox.find('.stretcher').hide();
							slides.eq(currSlide).fadeIn('fast',function () {
								transitioning = false;
							});
						}
					});
				});
			}
		});

		$('#next-proj').click(function () {
			projNum++;
			if (typeof history.pushState !== 'undefined') {
				history.pushState({}, "blah", "?project="+projNum)
			}
			lightBox.hide();
			slides.each(function (i){
				// Remove src to prevent vimeo videos playing
				$(this).attr('src', '');
			});
			lightBox = lightBox.next().next('.work-lightbox');
			initLightBox(lightBox, $(lightBox).prev().find('.work-item').attr('data-bg'));
		});

		$('#prev-proj').click(function () {
			projNum--;
			if (typeof history.pushState !== 'undefined') {
				history.pushState({}, "blah", "?project="+projNum)
			}
			lightBox.hide();
			slides.each(function (i){
				// Remove src to prevent vimeo videos playing
				$(this).attr('src', '');
			});
			lightBox = lightBox.prev().prev('.work-lightbox');
			initLightBox(lightBox, $(lightBox).prev().find('.work-item').attr('data-bg'));
		});


		$('#main-tinted-dark, #main-tinted-light, #proj-x').click(function () {
			if (typeof history.pushState !== 'undefined') {
				history.pushState({}, "blah", '?')
			}
			lightboxFadeOut(lightBox);
			slides.each(function (i){
				// Remove src to prevent vimeo videos playing
				$(this).attr('src', '');
			});
			$('#proj-nav').fadeOut('fast');
		});

		if (parseFloat(getParameterByName('project')) <= ($('.work-lightbox').length)-1) {
			lightBox = $('.work-lightbox').eq(parseFloat(getParameterByName('project')));
			initLightBox(lightBox, $(lightBox).prev().find('.work-item').attr('data-bg'));
			$('#proj-nav').fadeIn('fast');
		}

		$(window).resize(function () {
			position(lightBox)
		});
	})();

});