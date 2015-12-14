jQuery(function ($) {
	
	$(document).on('touchstart','html',function(e){
		e.preventDefault();
	});
	
	$(document).on('touchend','html',function($e){
		var e = $e.originalEvent;
		var list = e.touches;
		var changedList = e.changedTouches;
		
		console.log(changedList[0].clientX);
		$('body').html(changedList[0].clientY);
		
	});
	
});