jQuery(function ($) {
	
	var startX = 0;
	var nowX = 0;
	var endX = 0;
	var lastMoveX = 0;
	$(document).on('touchstart','#lgh',function(e){
		e.preventDefault();
		startX = e.originalEvent.changedTouches[0].clientX;
	});
	
	$(document).on('touchmove','#lgh',function($e){
		var e = $e.originalEvent;
		var list = e.touches;
		var changedList = e.changedTouches;
		
		nowX = changedList[0].clientX;
		
		console.log(nowX);
		
		$('#lgh').css({
			"transform":'translateX('+(nowX - startX + lastMoveX)+'px)',
			"-webkit-transform":'translateX('+(nowX - startX + lastMoveX)+'px)'
		});
		
		
		//$('body').html(changedList[0].clientY);
	});
	
	$(document).on('touchend','#lgh',function(e){
		endX = e.originalEvent.changedTouches[0].clientX;
		lastMoveX = endX - startX + lastMoveX;
	});	
	
	
	
	
});