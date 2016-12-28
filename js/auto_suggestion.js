(function($) {
	var defaults = {
		currentSelected: -1,
		toggleId: "suggestion_dropdown",
		parent_element: null,
		itemList: [],
		stext:'',
		option:'single',
		data:{}
	};
	
	$.fn.extend({
		UISugestion: function(options) {
			defaults =  $.extend(defaults, options);
			$(this).focus(function() {
				defaults.parent_element = $(this).attr('id');
				defaults.option = $(this).attr("option");

				if(!defaults.data.hasOwnProperty(defaults.parent_element)) {
					$.ajax({
						type:"POST",
						url:"data.php",
						data:{action:$(this).attr("id")},
						dataType:"json",
						success:function(resp) {
							defaults.itemList = resp;
							defaults.data[defaults.parent_element] = resp;
						}
					});
				} else {
					var resp = defaults.data[defaults.parent_element];
					defaults.itemList = resp;
				}
			});
			
			$(this).keyup(function(e){
				var key = e.keyCode || e.which;
				if(key != 38 && key != 40 && key != 13) {
					var stext = $(this).val();
					if(stext.length > 0) $(this).UISugestionItem(stext);
					else $("."+defaults.toggleId).remove();
				} 
				e.preventDefault();
			});

			$(this).click(function(){

			});
		},
				
		UISugestionItem: function(stext) {
			
			$("."+defaults.toggleId).remove();
			$("body").append("<div class=\""+defaults.toggleId+"\"></div>");
			
			defaults.currentSelected = -1;
			
			var left = $(this).position().left;
			var top = $(this).position().top+$(this).height()+5;
			$("."+defaults.toggleId).css({"left":left+"px", "top":top+"px"});

			var itemLimit = 0;
			for(i=0; i<defaults.itemList.length; i++) {
				var itext = defaults.itemList[i].txt;
				itext = itext.toLowerCase();
				stext = stext.toLowerCase();
				//console.log(itext+"---"+stext);
				if(itext.indexOf(stext)==0 && itemLimit<=20) {
					$("<li>"+defaults.itemList[i].txt+"</li>").css({"width":$("#"+defaults.parent_element).width()-5+"px"})
					.appendTo("."+defaults.toggleId);
					itemLimit++;
				}
			}
			$("."+defaults.toggleId).action();

			//$(document).unbind('keydown').bind('keydown',function(e)	
			$(document).bind('keydown',function(e) {
				$("."+defaults.toggleId).scroller(e);
			});
			
			$(document).unbind('click').bind('click', function(e) {
				var $clicked = $(e.target);
				if (defaults.parent_element!=$clicked.attr('id') && $clicked.parents('div').attr('class')!='suggestion_dropdown'){
					$("."+defaults.toggleId).remove();	
				}
			});

			
		},
		
		scroller: function(e) {
			var key = e.keyCode || e.which;
			var len = $("."+defaults.toggleId).find('li').length-1;
			//alert($("."+defaults.toggleId).length);
			if($("."+defaults.toggleId).length != 0){
				if(key==38 || key==40) {
					if(key==38) {
						if(defaults.currentSelected>0) defaults.currentSelected--;	
					} else {
						if(defaults.currentSelected<len) defaults.currentSelected++;
					}

					//this 'each' function is called every key press of upkey & downkey. 
					$("."+defaults.toggleId).find('li').each(function(i) {
						if(defaults.currentSelected==i) {
							$(this).removeClass('privacyMenuUnselected').addClass('privacyMenuSelected');
						} else {
							$(this).removeClass('privacyMenuSelected').addClass('privacyMenuUnselected');
						}
					});

				} else if(key==13) {
					$("."+defaults.toggleId).find('li').each(function(i){
						if(defaults.currentSelected==i) {
							$("."+defaults.toggleId+" li").removeClass('selected');
							
							$("#"+defaults.parent_element).val($(this).text());
							$("."+defaults.toggleId).remove();
						}
					});
					e.preventDefault();
				} else {
					//scroll imporvement
					//defaults.currentSelected = 0;
				}	
			}
		},
		
		action: function() {
			$("."+defaults.toggleId).find("li:first").css({"border-top":"1px solid #E9E9E9"});
			$("."+defaults.toggleId).css({"margin-left":$("#"+defaults.parent_element).css("margin-left")});
			
			$("."+defaults.toggleId).find('li').each(function(i) {
				var cls = $(this).attr('class'); 
				$(this).mouseover(function() {
					$("."+defaults.toggleId).find("li").removeClass('privacyMenuSelected');
					defaults.currentSelected = i;
					$(this).removeClass('privacyMenuUnselected').addClass('privacyMenuSelected');
				}).mouseout(function() {
					// $(this).removeClass('privacyMenuSelected').addClass(cls);
				}).click(function() {
					$("#"+defaults.parent_element).val($(this).html());
					$("."+defaults.toggleId).remove();
					$("#"+defaults.parent_element).focus();
				});
		  });
		}
	});		
})(jQuery);

