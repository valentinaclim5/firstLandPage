

function lanzaPopUp(title,contenido,tipo, hasClose){
	if(tipo == undefined){
		tipo = "info"
	};

	if(hasClose == undefined){
		hasClose = false;
	}
	removeContent();
	$(".popupContent").append(contenido);
	$(".popupContainer h1").text(title);
	$(".popupContainer").addClass(tipo);
	if(!hasClose){
		$(".closePop").hide();
	}
	showPopup();
}

function removeContent(){
	$(".popupContent").empty();
	$(".popupContainer").removeClass().addClass("popupContainer");
	$(".closePop").show();
}

function showPopup(){
	$(".fondoPopUp").css({opacity:0, display:"block"}).animate({opacity:1}, function(){
		$(".popupContainer").animate({opacity:1});
	})
}

function hidePopUp(func){
	$(".fondoPopUp").animate({opacity:0}, function(){
		$(".fondoPopUp").css({display:"none"});
		$(".popupContainer").css({opacity: 0});	
		if (func!= undefined && typeof func === "function"){
			func.call();
		}
	})

}

$(function(){
	$(".closePop").click(function(){
		hidePopUp();
	})

	$('.closePop img').each(function(){
            var $img = jQuery(this);
            var imgID = $img.attr('id');
            var imgClass = $img.attr('class');
            var imgURL = $img.attr('src');

            jQuery.get(imgURL, function(data) {
                // Get the SVG tag, ignore the rest
                var $svg = jQuery(data).find('svg');

                // Add replaced image's ID to the new SVG
                if(typeof imgID !== 'undefined') {
                    $svg = $svg.attr('id', imgID);
                }
                // Add replaced image's classes to the new SVG
                if(typeof imgClass !== 'undefined') {
                    $svg = $svg.attr('class', imgClass+' replaced-svg');
                }

                // Remove any invalid XML tags as per http://validator.w3.org
                $svg = $svg.removeAttr('xmlns:a');

                // Replace image with new SVG
                $img.replaceWith($svg);

            }, 'xml');

        });

})