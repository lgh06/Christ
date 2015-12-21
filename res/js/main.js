(function(window,$) {
	var bedApp = {};
	
	bedApp.Main = function(){
	
		jQuery(function ($) {
			
			var nowTopCenter = 0; //上部 当前靠近最中间的是第几个元素
			var nowBtmCenter = 0; //下部 当前靠近最中间的是第几个元素
			var transitionMove = 0; //transition效果的move距离 TODO
			var lastMoveX = [];
			lastMoveX['.top'] = 0; //上方 上次移动的距离
			lastMoveX['.btm'] = 0; //下方 上次移动的距离
			var selected = []; //记录选中的图片位置,以便于进一步判断是否拼对,及跳转
			
			/**
			 * 生成图片
			 * @param {Object} position
			 */
			function genImages(position){
				var images = [];
				
				var arr = [];
				for(var i =1;i<=7;i++){
					arr.push(i);
				}
				arr.sort(function(){
					return Math.random()-0.5;
				}); //arr下标从0开始
				
				for(var i =1;i<=7;i++){
					images[i] = new Image();
					images[i].src = "../res/img/face/"+arr[i-1]+"-"+(position == 'top'?'1':'2')+".png";
					$(images[i]).data('order',arr[i-1]);
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
				
				var hrY = $('hr').offset().top;
				var startY = 0;		
				var tmpSelector = selector;
				
				$(document).on('touchstart',selector,function(e){
					e.preventDefault();
					startX = e.originalEvent.changedTouches[0].clientX;
					
					if(selector == '.circle'){
						startY = e.originalEvent.changedTouches[0].clientY;
						if( startY < hrY ){
							tmpSelector = '.top';
						}else if(startY > hrY){
							tmpSelector = '.btm';
						}			
					}
					$(tmpSelector).removeClass('transition');
				});
				
				$(document).on('touchmove',selector,function($e){
					var e = $e.originalEvent;
					var list = e.touches;
					var changedList = e.changedTouches;
					
					nowX = changedList[0].clientX;
					
					$(tmpSelector).css({
						/*"transform":'translateX('+(nowX - startX + lastMoveX)+'px)',
						"-webkit-transform":'translateX('+(nowX - startX + lastMoveX)+'px)'*/
						"margin-left":(nowX - startX + lastMoveX[tmpSelector])+"px"
					});
					//$('body').html(changedList[0].clientY);
				});
				
				$(document).on('touchend',selector,function(e){
					endX = e.originalEvent.changedTouches[0].clientX;
					
					lastMoveX[tmpSelector] = endX - startX + lastMoveX[tmpSelector];
					//TODO 位置检测 放置在正中间
					var centerPosition = findCenter(tmpSelector);
					var $centerElement ;
					if(centerPosition){
						$centerElement = $(tmpSelector).find( 'img:eq('+(centerPosition-1)+')' );
						fitToCenter( tmpSelector , $centerElement );
						selected[tmpSelector] = $centerElement.data('order');
					}
					console.log(selected);
				});	
				
				$(document).on('webkitTransitionEnd transitionend',selector,function(e){
					if(selector == '.circle'){
						return;
					}
					$(selector).removeClass('transition');
					
					lastMoveX[selector]-=transitionMove;
					
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
						
						
					}
					
					lastPostion = nowPosition;
				}
				
				
			}
			
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
				transitionMove = move;
				var oldmarin = $(block).css('margin-left');
				var newmargin = 0;
				newmargin = parseFloat(oldmarin) - move;
				
				$(block).addClass('transition');
				$(block).css('margin-left',newmargin+'px');		
			}
				
			appendImage('.top',genImages('top'));
			appendImage('.btm',genImages('btm'));
			
			slice('.top');
			slice('.btm');
			
		
			
			//中间部分的高度fix 使撑满屏幕
			$('.bottom img:first-child').on('load',function(e){
				var htmlHeight = $(window).height();
				var height = $('.up').outerHeight() + $('.center').outerHeight() + $('.bottom').outerHeight();
				if(height<htmlHeight){
					var originPadding = parseFloat($('.center').css('padding'));
					var plus = ( htmlHeight - height )/2;
					$('.center').css({
						'padding': originPadding+plus+'px'+'  0'
					});
				}
				
				//定位圆环位置
				$('.circle').css({
					left:($('body').width()-200)/2+'px',
					top:$('hr').offset().top-100+3+'px'
				});
				
				slice('.circle');		
			});
			
			$('img.gen').click(function(){
				if( selected['.top'] && selected['.btm'] ){
					if( selected['.top'] == selected['.btm'] ){
						location.href = './result.html#'+selected['.btm'];  //TODO
					}else{
						location.href = './result.html#0';  //TODO
					}
				}else if(!selected['.top']){
					alert('请从圆框中选择上方人物');
				}else{
					alert('请从圆框中选择下方人物');
				}
			});
		});	
	};

	bedApp.Result = function(){
		jQuery(function($){
			var $bg = $('img.bg');
			
			var hash = window.location.hash || '#0';
			
			var num = hash.substr(1,1);
			$bg.attr('src','../res/img/2/'+num+'.png');
			
			var $con = $('body');
			if($con.width()/$con.height()>360/530){
				$('img.snow').css('position','static');
				$('.container').css('height','auto');
			}
			
			//确定欢迎语
			function genTip(order,username){
				username = username || '欢欢';
				var arr = [];
				arr[0] = '';
				arr[1] = '将在圣诞为<span>'+username+'</span><br>承包所有的表情';
				arr[2] = '将在圣诞为<span>'+username+'</span><br>表演二人转';
				arr[3] = '将在圣诞陪<span>'+username+'</span><br>度过烛光晚餐';
				arr[4] = '将在圣诞做<span>'+username+'</span><br>一夜的老公';
				arr[5] = '将在圣诞带<span>'+username+'</span><br>去北极看企鹅';
				arr[6] = '将在圣诞约<span>'+username+'</span><br>看一场午夜零点的电影';
				arr[7] = '将在圣诞求<span>'+username+'</span><br>成为他的小公举';
				
				return arr[order];
			}
			
			$('p.tip').html(genTip(num));
			
			
			$('.replay').click(function(){
				location.href = './index.html'; //TODO 
			});
			
			
			
			//shadow层显示
			var shadowShow = 0;
			$('.game').click(function(){
				$('html,body').animate({scrollTop: 0},300);
				$('.shadow').addClass('show');
				shadowShow = 1;
			});
			
			$('.close').click(function(){
				$('.shadow').removeClass('show');
				shadowShow = 0;
				//转针角度清零
				setDegree($('.zhen'),0);
			});
			
			function setDegree($obj,deg){  
			    $obj.css({  
			        'transform':     'rotate('+deg+'deg)',  
			'-webkit-transform':     'rotate('+deg+'deg)',  
			        '-moz-transform':'rotate('+deg+'deg)',  
			        '-o-transform':  'rotate('+deg+'deg)'  
			    });  
			}  			
			
			//抽奖
			var clicking = 0;
			var time = 3; //剩下的抽奖机会
			var playedTimes = 1; //第几次玩 TODO
			if(playedTimes>1){ //TODO
				$('.rechou').removeClass('show');
			}
			$('.zhen').click(function(){
				var $that = $(this);
				if(clicking|| !shadowShow || !time){
					return;	
				}
				
				$that.css({
					'transition':'transform 2s'
				});
				
				time--;
				setDegree($(this),1170);
				
				clicking = 1;
				$that.on('webkitTransitionEnd transitionend',function(){
					clicking = 0;
				});
			});
			
		});
	}
	
	bedApp.Zhuan = function(){
		alert(2)
	}
	window.bedApp = bedApp;

})(window,jQuery);
