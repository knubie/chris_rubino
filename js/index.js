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

});