$(document).ready(function(){

	// Visual effects
	$('.work-item').hover(function(){
		$(this).children('.desc').css('background-color', $(this).attr('data-color'));
	},
	function(){
		$(this).children('.desc').css('background-color', '#FFFFFF');
	});
	var position = function(){
		console.log('hi');
		$('#main-tinted').css('width', $(window).width()-20).css('height', $(window).height()-10);
		$('.work-lightbox').css('top', function(){
			console.log($(this).height());
			return $(window).height()/2 - $(this).height()/2;
		});
		$('.work-lightbox').css('left', function(){
			return $(window).width()/2 - $(this).width()/2;
		});
	};

	var lightboxFadeOut = function(){
		$('#main-tinted').fadeOut();
		$('.work-lightbox').fadeOut();
	}

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

	$('.work-link').click(function(){
		$('#main-tinted').fadeIn();
		$('.work-lightbox').show();
		position();
	});

	$('#main-tinted').click(function(){
		lightboxFadeOut();
	});

	
	// On window resize

	position();
	$(window).resize(position());

});