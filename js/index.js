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

	// $('.work-lightbox > img, .work-lightbox > iframe').attr('data-src', function(){
	// 	return $(this).attr('src');
	// });
	// $('.work-lightbox > img, .work-lightbox > iframe').removeAttr('src');

	$('.work-lightbox').prepend('<div class="loading"></div>');

	// Lightbox

	(function () {

		var lightBox = $('.work-lightbox'),
				numSlides,
				slides,
				currSlide = 0,
				transitioning = false,
				projNum,
				$loading = lightBox.find('.loading'),
				$stretcher = lightBox.find('.stretcher');

		var resetVimeo = function() {
			slides.each(function (i){
				if ($(this).is('iframe')) {
					$(this).attr('src', '');
				}
			});
		}

		var lightboxFadeOut = function(lightBox) {
			$('#main-tinted-dark, #main-tinted-light').fadeOut();
			lightBox.fadeOut();
			resetVimeo();
		};

		var position = function(lightBox) {
			$('#main-tinted-light, #main-tinted-dark').css('width', $(window).width()-20).css('height', $(window).height()-10);
			lightBox.css('top', function() {
				return $(window).height()/2 - $(this).height()/2;
			});
			lightBox.css('left', function() {
				return $(window).width()/2 - $(this).width()/2;
			});
			lightBox.find('.title').css('margin-right', function() {
				return 0 -$(this).width();
			});
			lightBox.find('.details').css('margin-left', function() {
				return 0 - $(this).width();
			});
		};


		var initLightBox = function (lightBox, bg) {

			// lightbox variables
			numSlides = lightBox.children('img, iframe').length;
			slides = lightBox.children('img, iframe');
			currSlide = 0;
			transitioning = false;
			$loading = lightBox.find('.loading');
			$stretcher = lightBox.find('.stretcher');

			// Inject slide count
			lightBox.find('.slide-count').text(currSlide+1+" of " + numSlides);

			// Display initial elements
			if (bg === 'dark') {
				$('#main-tinted-light:visible').fadeOut();
			} else {
				$('#main-tinted-dark:visible').fadeOut();
			}
			$('#main-tinted-'+bg).fadeIn();
			slides.hide();
			$loading.show();
			lightBox.css('width', '');
			lightBox.css('height', '');
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
			position(lightBox);

			// start vimeo video if it's the current slide
			if (slides.eq(currSlide).is('iframe')) {
				slides.eq(currSlide).attr('src', function(){
					return $(this).attr('data-src');
				});
			}

			// Load images in slideshow
			lightBox.children('img').attr('src', function(){
				return $(this).attr('data-src');
			});
			
			
			lightBox.fadeIn(function(){

				lightBox.imagesLoaded(function () {

					$loading.hide();

					// retain lightbox dimensions after loading hides
					$stretcher.css('height', $loading.height()+2).show();
					lightBox.css('width', $loading.width());

					// begin animating lightbox dimensions to fit next slide
					$stretcher.animate({
						height: slides.eq(0).height()+2
					}, {
						duration: 400,
						queue: false
					});

					lightBox.animate({
						width:  	 slides.eq(currSlide).width(),
						// Add 30 to height for bottom navbar
						top: 			 $(window).height()/2 - (slides.eq(0).height() + 30) / 2,
						left: 		 $(window).width()/2 - slides.eq(0).width()/2
					}, {
						duration:  400,
						queue: false,
						complete:  function () {
							$stretcher.hide();
							// fade in new slide
							slides.eq(0).fadeIn('fast',function () {
								transitioning = false;
							});
						}
					});

				}); // images loaded

			}); // fadein callback
			
		};

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

				// Fix lightbox dimension after image is hidden
				lightBox.css('width', slides.eq(currSlide).width());
				$stretcher.css('height', slides.eq(currSlide).height()+2);
				
				slides.eq(currSlide).fadeOut('fast', function () {

					$stretcher.show();

					// Pause vimeo video
					resetVimeo();

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

					if ($stretcher.height() !== slides.eq(currSlide).height()+2) {
						$stretcher.animate({
							height: slides.eq(currSlide).height()+2
						}, { duration: 400 });
					}

					if ($stretcher.height() !== slides.eq(currSlide).height()+2 || lightBox.width() !== slides.eq(currSlide).width()) {
						lightBox.animate({
							width:  	 slides.eq(currSlide).width(),
							// Add 30 to height for bottom navbar
							top: 			 $(window).height()/2 - (slides.eq(currSlide).height() + 30) / 2,
							left: 		 $(window).width()/2 - slides.eq(currSlide).width()/2
						}, {
							step: 		 function () {},
							duration:  400,
							complete:  function () { 
								$stretcher.hide();
								// Put src back in for vimeo videos
								slides.eq(currSlide).attr('src', function(){
									return $(this).attr('data-src');
								});
								slides.eq(currSlide).fadeIn('fast', function () {
									transitioning = false;
								});
							}
						});
					} else {
						$stretcher.hide();
						// Put src back in for vimeo videos
						slides.eq(currSlide).attr('src', function(){
							return $(this).attr('data-src');
						});
						slides.eq(currSlide).fadeIn('fast', function () {
							transitioning = false;
						});
					}
				});
			}
		});

		$('#next-proj').click(function () {
			projNum++;
			if (typeof history.pushState !== 'undefined') {
				history.pushState({}, "blah", "?project="+projNum)
			}
			lightBox.hide();
			resetVimeo();
			lightBox = lightBox.next().next('.work-lightbox');
			initLightBox(lightBox, $(lightBox).prev().find('.work-item').attr('data-bg'));
		});

		$('#prev-proj').click(function () {
			projNum--;
			if (typeof history.pushState !== 'undefined') {
				history.pushState({}, "blah", "?project="+projNum)
			}
			lightBox.hide();
			resetVimeo();
			lightBox = lightBox.prev().prev('.work-lightbox');
			initLightBox(lightBox, $(lightBox).prev().find('.work-item').attr('data-bg'));
		});


		$('#main-tinted-dark, #main-tinted-light, #proj-x').click(function () {
			if (typeof history.pushState !== 'undefined') {
				history.pushState({}, "blah", '?')
			}
			lightboxFadeOut(lightBox);
			$('#proj-nav').fadeOut('fast', function(){
				resetVimeo();
			});
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