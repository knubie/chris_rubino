$(document).ready(function(){

	// Query string

	function getParameterByName(name) {

    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);

    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));

	}

	// Visual effects
	$('.work-item').hover(function(){
		$(this).children('.desc').css('background-color', $(this).attr('data-color'));
	},
	function(){
		$(this).children('.desc').css('background-color', '#FFFFFF');
	});
	$('#head-right > img').hover(function(){
			this.src = this.src.replace('up','down');
	}, function() {
			this.src = this.src.replace('down','up');
	});



	// Filters

	$('#filter-container').hover(function(){
		$('#filter').stop().animate({
			width: 500
		}, 250, false);
	}, function(){
		$('#filter').stop().animate({
			width: 0
		}, 250, false);
	})
	$('#inner-filters > a:link').click(function(){
		console.log('hello');
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
		};

	});

	// Lightbox

	(function(){

		var lightboxFadeOut = function(lightBox){
			$('#main-tinted').fadeOut();
			lightBox.fadeOut();
		}

		var position = function(lightBox){
			$('#main-tinted').css('width', $(window).width()-20).css('height', $(window).height()-10);
			lightBox.css('top', function(){
				return $(window).height()/2 - $(this).height()/2;
			});
			$('.work-lightbox:visible').css('left', function(){
				return $(window).width()/2 - $(this).width()/2;
			});
			$('.work-lightbox > .bottom-bar > .title:visible').css('margin-right', function(){
				return 0 -$(this).width();
			});
			$('.details:visible').css('margin-left', function(){
				return 0 - $(this).width();
			});
		};


		var initLightBox = function(lightBox){
			numSlides = lightBox.children('img').length;
			slides = lightBox.children('img');
			currSlide = 0;
			transitioning = false;

			// Inject slide count
			lightBox.find('.slide-count').text(currSlide+1+" of " + numSlides);

			// Display initial elements
			$('#main-tinted').fadeIn();
			lightBox.fadeIn();
			slides.hide();
			$('.work-lightbox img:first-child').show();
			lightBox.css('width', '');
			lightBox.css('height', '');
			position(lightBox);
			if (lightBox.prev().prev().length == 0) {
				$('#prev-proj').hide();
				$('#next-proj').text('next project');
			} else {
				$('#prev-proj').show();
				$('#next-proj').text(' / next project');
			}
			if (lightBox.next().next().length == 0) {
				$('#next-proj').hide();
			} else {
				$('#next-proj').show();
			}
		};

		var lightBox = $('.work-lightbox'),
				numSlides,
				slides,
				currSlide = 0,
				transitioning = false,
				projNum;

		$('.work-link').click(function(){

			// Set query string
			projNum = $(this).prevAll('.work-link').length;
			history.pushState({}, "blah", "?project="+projNum)

			// Establish context
			lightBox = $(this).next('.work-lightbox');
			initLightBox(lightBox);
			$('#proj-nav').fadeIn('fast');

		});

		lightBox.find('.details, .x').click(function(){
			lightBox.find('.desc-box').slideToggle('fast');
		});

		lightBox.find('.arrow').click(function(){

			// Get arrow direction
			var dir = $(this).attr('data-dir');

			if (transitioning === true || (currSlide+1 === numSlides && dir === 'right') || (currSlide === 0 && dir === 'left')) {
				return;
			} else {

				// Start transition
				transitioning = true;
				slides.eq(currSlide).animate({opacity: 0}, 'fast', function(){

					$(this).hide().css('opacity', 1);

					// Fix lightbox dimension after image is hidden
					lightBox.css('width', slides.eq(currSlide).width());
					lightBox.find('.stretcher').css('height', slides.eq(currSlide).height()).show();
					// lightBox.css('height', slides.eq(currSlide).height()+30);

					(dir === 'right') ? currSlide++ : currSlide--;
					lightBox.find('.slide-count').text(currSlide+1+" of " + numSlides);

					lightBox.find('.stretcher').animate({
						height: slides.eq(currSlide).height()
					}, { duration: 500 });
					lightBox.animate({
						width:  	 slides.eq(currSlide).width(),
						top: 			 $(window).height()/2 - slides.eq(currSlide).height()/2,
						left: 		 $(window).width()/2 - slides.eq(currSlide).width()/2
					}, {
						step: 		 function(){},
						duration:  500,
						complete:  function(){ 
							lightBox.find('.stretcher').hide();
							slides.eq(currSlide).fadeIn('fast',function(){
								transitioning = false;
							});
						}
					});
				});
			}
		});

		$('#next-proj').click(function(){
			projNum++;
			history.pushState({}, "blah", "?project="+projNum)
			lightBox.hide();
			lightBox = lightBox.next().next('.work-lightbox');
			initLightBox(lightBox);
		});

		$('#prev-proj').click(function(){
			projNum--;
			history.pushState({}, "blah", "?project="+projNum)
			lightBox.hide();
			lightBox = lightBox.prev().prev('.work-lightbox');
			initLightBox(lightBox);
		});


		$('#main-tinted, #proj-x').click(function(){
			history.pushState({}, "blah", '?')
			lightboxFadeOut(lightBox);
			$('#proj-nav').fadeOut('fast');
		});

		if (parseFloat(getParameterByName('project')) <= ($('.work-lightbox').length)-1) {
			lightBox = $('.work-lightbox').eq(parseFloat(getParameterByName('project')));
			initLightBox(lightBox);
			$('#proj-nav').fadeIn('fast');
		}

		$(window).resize(function(){
			position(lightBox)
		});
	})();

});