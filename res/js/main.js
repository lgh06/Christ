jQuery(function ($) {
	
	function genImages(position){
		var images = [];
		for(var i =1;i<=7;i++){
			images[i] = new Image();
			images[i].src = "../res/img/face/"+i+"-"+(position == 'top'?'1':'2')+".png";
		}
		return images; //images.length = 8
	}
	
	function appendImage(selector,images){
		for(var i = 1;i<=images.length-1;i++){  //数组下标1到(8-1)
			$(selector).append(images[i]);
		}
	}
	
	function slice(selector){
		var startX = 0;
		var nowX = 0;
		var endX = 0;
		var lastMoveX = 0;
		$(document).on('touchstart',selector,function(e){
			e.preventDefault();
			startX = e.originalEvent.changedTouches[0].clientX;
		});
		
		$(document).on('touchmove',selector,function($e){
			var e = $e.originalEvent;
			var list = e.touches;
			var changedList = e.changedTouches;
			
			nowX = changedList[0].clientX;
			
			console.log(nowX);
			
			$(selector).css({
				"transform":'translateX('+(nowX - startX + lastMoveX)+'px)',
				"-webkit-transform":'translateX('+(nowX - startX + lastMoveX)+'px)'
			});
			//$('body').html(changedList[0].clientY);
		});
		
		$(document).on('touchend',selector,function(e){
			endX = e.originalEvent.changedTouches[0].clientX;
			lastMoveX = endX - startX + lastMoveX;
		});	
	}
	
		
	appendImage('.top',genImages('top'));
	appendImage('.btm',genImages('btm'));
	
	slice('.top');
	slice('.btm');
	
});