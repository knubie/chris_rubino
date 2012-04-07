$(document).ready(function(){
	$('.work-item').hover(function(){
		$(this).children('.desc').css('background-color', $(this).attr('data-color'));
	},
	function(){
		$(this).children('.desc').css('background-color', '#FFFFFF');
	});
});