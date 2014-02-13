// inventroy.js

(function($) {
	$.fn.inventory = function(options) {
	
		var defaults = {
			class: null,
			clear: null,
			single: null,
			width: 0,
			height: 0,  
			spacing: 0,
			blockWidth: 0,
			blockHeight: 0,
			responsive: true,
			columns: {
				0:3,
				750:5	
			}
		};
	
		return this.each(function() {
			
			var settings = $.extend(defaults, options);
			var inventoryItems = [];
			var inventoryGrid = [];  
			var obj = $(this);
			
			obj.children(settings.class).each(function(){
				inventoryItems.push($(this).clone());   
			});
				
			setup();
			
			$(window).resize(function() {
				setup();
			});
			
			//
			//	Classes
			//
			
			function Box(object,width,height,indexX,indexY,col){
				return {
					object:object,
					width:width,
					height:height,
					indexX:indexX,
					indexY:indexY,
					col: col
				}
			}
			
			function Slot(box,x,y,index){
				return {
					box:box,
					x:x,
					y:y,
					index:index
				}
			}
			
			// 
			//	Functions
			//
			
			function setup() {
				restart();
				
				obj.children(settings.class).remove();
				$.each(inventoryItems, function(key, value){
					obj.append(value);   
				});			   
			
				if(settings.responsive){
					$.each(settings.columns, function(key, value){
						if(key<obj.width())settings.width = value;
					});
					settings.blockWidth = obj.children(settings.single).width();
					settings.blockHeight = settings.blockWidth;
				}
			
				settings.height = 50;
			
				for(var h=0;h<settings.height;h++){
					inventoryGrid[h] = [];
					for(var w=0;w<settings.width;w++){
						inventoryGrid[h].push(Slot(null,w,h,null));
					}
				}
				for(var h=0;h<settings.height;h++){
					for(var w=0;w<settings.width;w++){
					}
				}
				
				addBoxes();
				drawGrid();
			}
			
			function addBoxes(){
				var boxes = obj.children(settings.class);
				boxes.each(function(){
					var w=1;
					var h=1;
					if($(this).width()>settings.blockWidth+1){
						w = 2;
						if($(this).width()>settings.blockWidth*2+1){
							w = 3;
						}
						if($(this).height()>settings.blockWidth+1){
							h = 2;
						}
					} else if($(this).height()>settings.blockWidth+1) {
						h = 2
					}
					console.log(w+' '+h);
					var box = Box($(this),w,h,null,null,(Math.random().toString(16) + '000000').slice(2, 8));
					addBox(box);	
				});
				for(var h=0;h<inventoryGrid.length;h++){
					var nuller = 0;
					for(var w=0;w<settings.width;w++){
						if(inventoryGrid[h][w].box==null){
							delete inventoryGrid[h][w];
						} else {
							nuller++;	
						}
					}
					if(!nuller>0){
						inventoryGrid.length = h;
					}
				}
				settings.height = inventoryGrid.length;
				obj.css({
					height: settings.height*settings.blockHeight+settings.height*settings.spacing
				});
			}
			
			function addBox(box){
				var indexW = 0, indexH = 0, free = 0;
				for(var y=0;y<inventoryGrid.length+box.height+1;y++){
					if(inventoryGrid[y]!=null){
						for(var x=0;x<inventoryGrid[y].length-box.width+1;x++){
							if(inventoryGrid[y][x].box==null){
								for(var h=0;h<box.height;h++){
									for(var w=0;w<box.width;w++){
										if(inventoryGrid[y+h][x+w].box==null){
											free++;	
										} else {
											
										}
										if(free==box.width*box.height){
											indexW = x;
											indexH = y;
											break;	
										} else {
											if(inventoryGrid[y+h][x+w]==null){
											}
										}
									}
									if(free==box.width*box.height){
										break;	
									}
								}
								if(free==box.width*box.height){
									break;	
								}
							}
							if(free==box.width*box.height){
								break;	
							}
						}
						if(free==box.width*box.height){
							break;	
						}
					}
				}
				if(free==box.width*box.height){
					box.indexX = indexW;
					box.indexY = indexH;
					for(var w=0;w<box.width;w++){
						for(var h=0;h<box.height;h++){
							var slot = inventoryGrid[indexH+h][indexW+w];
							if(w==0&&h==0){
								inventoryGrid[indexH+h][indexW+w] = Slot(box,slot.x,slot.y,true);
							} else {
								inventoryGrid[indexH+h][indexW+w] = Slot(box,slot.x,slot.y,false);	
							}
						}
					}
				}
			}
			
			function drawGrid(){
				for(var h=0;h<settings.height;h++){
					if(inventoryGrid[h]!=null){
						for(var w=0;w<settings.width;w++){
							if(inventoryGrid[h][w]!=null){
								if(inventoryGrid[h][w].box==null){
									
								} else if(inventoryGrid[h][w].index==false){
								
								} else {
									obj.append(inventoryGrid[h][w].box.object);
									inventoryGrid[h][w].box.object.css({
										position: "absolute",
										margin: '0',
										top: parseFloat(inventoryGrid[h][w].y * (settings.blockHeight).toFixed(2)) + inventoryGrid[h][w].y*settings.spacing,
										left: parseFloat(inventoryGrid[h][w].x * (settings.blockWidth).toFixed(2)) + inventoryGrid[h][w].x*settings.spacing,
									});
								}
							}
						}
					}
				}
				obj.append(obj.children(settings.clear));
			}
			
			function restart(){
				settings = $.extend(defaults, options);
				inventoryGrid.length = 0;
			}
		});
	};
})(jQuery);