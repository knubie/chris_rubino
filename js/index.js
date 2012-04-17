$(document).ready(function(){

	// Visual effects
	$('.work-item').hover(function(){
		$(this).children('.desc').css('background-color', $(this).attr('data-color'));
	},
	function(){
		$(this).children('.desc').css('background-color', '#FFFFFF');
	});
	$('#head-right > img').hover(function(){
			console.log('hey');
			this.src = this.src.replace('up','down');
	}, function() {
			this.src = this.src.replace('down','up');
	});



	// Filters
	$('#filter > a:link').click(function(){
		var cat = '.' + $(this).attr('data-cat');
		if (cat === '.all') {
			$('.work-item').removeClass('hide-me').show();
			$('#filter > a:link').css('border-bottom', 'none');
		} else {
			$('#filter > a:link').css('border-bottom', 'none');
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
			$('.work-lightbox').css('left', function(){
				return $(window).width()/2 - $(this).width()/2;
			});
			$('.work-lightbox > .bottom-bar > .title').css('margin-right', function(){
				return 0 -$(this).width();
			});
			$('.details').css('margin-left', function(){
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
		};

		var lightBox = $('.work-lightbox'),
				numSlides,
				slides,
				currSlide = 0,
				transitioning = false;

		$('.work-link').click(function(){

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
			lightBox.hide();
			lightBox = lightBox.siblings('.work-lightbox').first();
			initLightBox(lightBox);
		});

		$('#main-tinted, #proj-x').click(function(){
			lightboxFadeOut(lightBox);
			$('#proj-nav').fadeOut('fast');
		});

	})();





	// On window resize

	// $(window).resize(position());

});