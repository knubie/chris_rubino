$(document).ready(function(){

	// Visual effects
	$('.work-item').hover(function(){
		$(this).children('.desc').css('background-color', $(this).attr('data-color'));
	},
	function(){
		$(this).children('.desc').css('background-color', '#FFFFFF');
	});



	// Filters
	$('#filter > a').click(function(){
		var cat = '.' + $(this).attr('data-cat');
		if (cat === '.all') {
			$('.work-item').removeClass('hide-me').show();
		} else {
			$('.work-item').addClass('hide-me');
			$(cat).removeClass('hide-me');
			$('.hide-me').hide();
			$(cat).show();
		};

	});

	// Lightbox

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
		$('.details').css('margin-left', function(){
			return 0 - $(this).width();
		});
	};

	(function(){

		var lightBox = $('.work-lightbox'),
				numSlides,
				slides,
				currSlide = 0,
				transitioning = false;

		$('.work-link').click(function(){

			// Establish context
			lightBox = $(this).next('.work-lightbox');
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
						step: 		 function(){
							// position(lightBox);
							// console.log('window width '+$(window).width()/2);
							// console.log('box width '+lightBox.width()/2);
							// console.log('left should be '+($(window).width()/2-lightBox.width()/2));
							// console.log("but it's actually "+lightBox.css('left'));
						},
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

		$('#main-tinted').click(function(){
			lightboxFadeOut(lightBox);
		});

	})();





	// On window resize

	// $(window).resize(position());

});