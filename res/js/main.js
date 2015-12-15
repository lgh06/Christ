jQuery(function ($) {
	
	var nowTopCenter = 0; //上部 当前靠近最中间的是第几个元素
	var nowBtmCenter = 0; //下部 当前靠近最中间的是第几个元素
	
	/**
	 * 生成图片
	 * @param {Object} position
	 */
	function genImages(position){
		var images = [];
		for(var i =1;i<=7;i++){
			images[i] = new Image();
			images[i].src = "../res/img/face/"+i+"-"+(position == 'top'?'1':'2')+".png";
		}
		return images; //images.length = 8
	}
	
	/**
	 * 将生成的图片插入DOM
	 * @param {Object} selector
	 * @param {Object} images
	 */
	function appendImage(selector,images){
		for(var i = 1;i<=images.length-1;i++){  //数组下标1到(8-1)
			$(images[i]).data('order',i);
			$(selector).append(images[i]);
		}
	}
	
	/**
	 * 滑动 touch事件 改变margin-left
	 * @param {Object} selector
	 */
	function slice(selector){
		var startX = 0;
		var nowX = 0;
		var endX = 0;
		var lastMoveX = 0;
		$(document).on('touchstart',selector,function(e){
			e.preventDefault();
			$(selector).removeClass('transition');
			startX = e.originalEvent.changedTouches[0].clientX;
		});
		
		$(document).on('touchmove',selector,function($e){
			var e = $e.originalEvent;
			var list = e.touches;
			var changedList = e.changedTouches;
			
			nowX = changedList[0].clientX;
			
			console.log(nowX);
			
			$(selector).css({
				/*"transform":'translateX('+(nowX - startX + lastMoveX)+'px)',
				"-webkit-transform":'translateX('+(nowX - startX + lastMoveX)+'px)'*/
				"margin-left":(nowX - startX + lastMoveX)+"px"
			});
			//$('body').html(changedList[0].clientY);
		});
		
		$(document).on('touchend',selector,function(e){
			endX = e.originalEvent.changedTouches[0].clientX;
			lastMoveX = endX - startX + lastMoveX;
			//TODO 位置检测 放置在正中间
		});	
		
		$(document).on('webkitTransitionEnd transitionend',selector,function(e){
			$(selector).removeClass('transition');
		});	
	}
	
	
	/**
	 * 寻找中间元素
	 */
	function findCenter(block,width,margin){
		var $img = $(block).find('img:first-child');
		var firstPosition = $img.offset().left; //第一张图片所处的left位置
		var bodywidth = $('body').width();
		if(width === undefined){
			var width = $img.width();	
		}
		if(margin === undefined){
			var margin = parseFloat( $img.next('img').css('margin-left') );
		}
		
		var nowPosition = firstPosition?firstPosition:0;
		var lastPosition = 0;
		for(var i = 1;i<=$(block).find('img').length;i++){
			nowPosition += width+margin;
			
			if( (nowPosition - (bodywidth/2)) * (lastPosition - (bodywidth/2)) <=0 ){ //now在中间右侧，last在中间左侧
				var numLeft = Math.abs( lastPosition - (bodywidth/2) );
				var numRight = Math.abs( nowPosition - (bodywidth/2) );
				if(numLeft>numRight){ //左侧距离远 返回右侧now的序号
					return i;
				}else if(numLeft<numRight){ //右侧距离远，返回左侧last的序号
					return i-1;
				}else{
					return false;
				}
				
				debugger;
				
			}
			
			lastPostion = nowPosition;
		}
		
		
	}
	
	window.findCenter = findCenter;
	
	/**
	 * 将某个元素通过修改.top或者.btm的margin-left使其水平居中
	 * modify parent element's margin-left to center the element.
	 */
	function fitToCenter(block,selector){
		var $ele = $(selector);
		var offset = $ele.offset();
		var width = $ele.width();
		var bodywidth = $('body').width();
		
		var move = 0;
		move = offset.left + (width/2) - (bodywidth/2);
		var oldmarin = $(block).css('margin-left');
		var newmargin = 0;
		newmargin = parseFloat(oldmarin) - move;
		
		$(block).addClass('transition');
		$(block).css('margin-left',newmargin+'px');		
	}
	window.fitToCenter = fitToCenter;
	
		
	appendImage('.top',genImages('top'));
	appendImage('.btm',genImages('btm'));
	
	slice('.top');
	slice('.btm');
	
});