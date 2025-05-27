$(document).ready(function(){
	var competencia_unidad = curso.unidades[curso.currIndex].competence;
	var indice_pag_actual = curso.unidades[curso.currIndex].currIndex; 
	if(seguim.vSegJSON[competencia_unidad]["pags"][indice_pag_actual]["vd"]==1){
		$(".trans_check img").attr("src", "img/svg/checkbox_checked.svg");
	}
	
	$("video").on("loadeddata", function (e) {
		if (isSessionLMS) {
			establecerAlturaScorm($(".contenido_scorm"), $(".subfoo.mostrar"));
		}	
	});
	$("video").on("ended", function (e) {
		updateNav(curso.unidades[curso.currIndex], false);
	});
	$(".trans_check").bind({
		click: function(e){
			activarCheck($(this));
		},
		keypress: function(e){
			if(e.which == 13) {
				activarCheck($(this));
			}
		}
	});


	$(".ver_trascripcion").css("cursor", "pointer");

	$(".ver_trascripcion").bind({
		click: function(e){
			accionarDeplegable();
		},
		keypress: function(e){
			if(e.which == 13) {
				accionarDeplegable();
			}
		}
	});
	
	function accionarDeplegable(){
		if($(".btn_desplegable").hasClass("pulsado")){
			$(".btn_desplegable").removeClass("pulsado");
		}
		else{
			$(".btn_desplegable").addClass("pulsado");
		}
	
		$(".transcripcion").slideToggle(function() {
			if (isSessionLMS) {
			establecerAlturaScorm($(".contenido_scorm"), $(".subfoo.mostrar"));
			}
		});
	}
	function activarCheck(elemento){
		$("img", elemento).attr("src", "img/svg/checkbox_checked.svg");
		seguim.vSegJSON[competencia_unidad]["pags"][indice_pag_actual]["vd"]="1";
		updateNav(curso.unidades[curso.currIndex], false);
	}
});