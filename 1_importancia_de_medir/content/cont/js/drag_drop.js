$(document).ready(function(){
	//deshabilitamos el boton aceptar
		$(".prioridades").draggable({ revert: 'invalid' , opacity: .5, /*axis: "x",*/ containment: ".drag_table", scroll: false });
		$(".prioridades").css("cursor", "pointer");
	    $(".questions").droppable({	
	    	//accept: '.prioridades',
	    	accept: function(drag){
				$this = $(this);
	    		//si coincide el id del drag, con el data-aceptar del drop, lo depositamos 
	    		/*if ($this.data("aceptar")==drag.attr("id"))
	    		{
	    			return true;
	    		}
	    		else
	    		{
	    			return false;
	    		}*/
	    		return true;
	    	},
			hoverClass: 'drop_hover',
			drop: function(event, ui) {
				$this = $(this);
				ui.draggable.draggable({ revert: 'invalid' , opacity: .5});
				if(! $this.hasClass('ocupado'))
				{
					$(".questions").each(function(){
						$this2 = $(this);
						if ($this2.hasClass('ocupado ' + ui.draggable.attr('id'))) 
						{
							$this2.removeClass('ocupado ' + ui.draggable.attr('id'));
							$this2.data('result', '0');
						}
					});
					ui.draggable.position({of: $(this), my: 'center top', at: 'center top'});
					/* var top =  parseInt(ui.draggable.css("top"));
					top = top + 26;
					ui.draggable.css("top", top); */
					//console.log(ui.draggable);
					//ui.draggable.css("background-color","rgba(255,255,255,0)");
					//$this.css("background", "#35384A");
					$this.addClass('ocupado ' + ui.draggable.attr('id'));
					$this.data('result', ui.draggable.attr('id'));					
					checkCompletado();
				}
				else
				{
					ui.draggable.draggable('option', 'revert', true);
				}
			}
	    });

	    $(".botonesPrioridad").droppable({
	    	accept: '.prioridades',
			hoverClass: 'drop_hover',
			drop: function(event, ui) {
				ui.draggable.draggable({ revert: 'invalid' , opacity: .5});
			
				$(".questions").each(function(){ 
						$this = $(this);
						if($this.hasClass('ocupado '+ ui.draggable.attr('id')))
						{
							$this.removeClass('ocupado ' + ui.draggable.attr('id'));
							//$this.css("background", "white");
							$this.data('result', '0');
						}
				});
				//coloca en la posicion inicial los drags, si no encuentra una zona drop disponible
				//cambiamos el color de fondo de nuevo
				ui.draggable.position({of: $("#div"+(ui.draggable.attr('id'))), my: 'left top',at: 'left top'});

				checkCompletado();
			}
	    });	
 }); 

function clickAceptar(){
	var puntuacion = 0;
	var drops = $(".questions");
	drops.each(function (idx) {
 		var $drop = $(this);
		//si el drop tiene la clase priority que coincida con el data-correcta entonces sumamos
		var correctas = $drop.data("correcta").split(",");
		var acierto = false;
		for (i in correctas){
			if($drop.hasClass(correctas[i]))
			{
				acierto = true;
			}
		}
	
		var id = $(this).attr("id");
		id = id.substring(id.indexOf("_")+1, id.length);
		if (acierto){
			puntuacion++;
			$("#feedback_" + id + " #acierto").css("display", "block");
			$("#feedback_" + id + " #acierto").css("opacity", "1");
			$("#feedback_" + id + " #fallo").css("display", "none");
		}
		else{
			$("#feedback_" + id + " #fallo").css("display", "block");
			$("#feedback_" + id + " #fallo").css("opacity", "1");
			$("#feedback_" + id + " #acierto").css("display", "none");
		}
 	});
	//guardamos la nota
	//var pagina_actual = curso.unidades[curso.currIndex].paginas[indice_pag_actual];
	var resultado = "";
    if(drops.length == puntuacion){
		//correcto
		$("#capaacierto").css("display", "block");
		$("#capafallo").css("display", "none");
		resultado = "1";
		$(".prioridades").draggable("disable");
		updateNav(curso.unidades[curso.currIndex], false);
		$(".prioridades").css("cursor", "inherit");
    }
    else{
		//incorrecto
		$("#capafallo").css("display", "block");
		$("#capaacierto").css("display", "none");
		resultado = "0";
	}
	
    if (isSessionLMS) {
		establecerAlturaScorm($(".contenido_scorm"), $(".subfoo.mostrar"));
	}
	var nuevo_intento = {};
	
	var fecha = new Date();
	var dformat = [
		fecha.getDate(),
		fecha.getMonth()+1,
		fecha.getFullYear()].join('/')+' '+
	   	[fecha.getHours(),
		((fecha.getMinutes() < 10) ? ":0" : ":") + fecha.getMinutes(),
		((fecha.getSeconds() < 10) ? ":0" : ":") + fecha.getSeconds()].join('');
	
	nuevo_intento["dt"] = dformat;	
	nuevo_intento["nf"] = resultado;

	var competencia_unidad = curso.unidades[curso.currIndex].competence;
	var indice_pag_actual = curso.unidades[curso.currIndex].currIndex; 		
	var indice = seguim.vSegJSON[competencia_unidad]["pags"][indice_pag_actual]["in"].length;
	seguim.vSegJSON[competencia_unidad]["pags"][indice_pag_actual]["in"][indice] = nuevo_intento;
 };

 function checkCompletado(){
 	var todos_marcados=true;
 	//hacemos un bucle para mirar las duplas de drops, si todas las duplas tienen 1 elemento se habilita el boton aceptar
 	$(".questions").each(function (idx) {
 		var drops_tr = $(this); 		
 		//si alguno no ha sido marcado, no habilitamos el boton aceptar
		if (!drops_tr.hasClass('ocupado'))
		{
			todos_marcados = false;
		}
 	})

	if(todos_marcados)
	{
		clickAceptar();
	}
 };

 
