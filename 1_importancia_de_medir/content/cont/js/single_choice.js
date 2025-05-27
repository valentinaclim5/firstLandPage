var contapuls = 0;
var resetearWrong = false;
var feedbackfallo = $("#capafallo").text();
$("#capafallo").text("");

$(document).ready(function(){
    //al hacer click en un elemento
    $('.item').bind({
        click: function(e){
            funcionalidad($(this));
        },
        keypress: function(e){
            if(e.which == 13) {
                funcionalidad($(this));
            }
        }
    });

    function funcionalidad(elemento){
        if(!elemento.hasClass("disabled")){
            $(".feedback #fallo").addClass("check");
            var resultado = 0;
            //marcamos el segundo elemento
            if (elemento.attr("data-value") == "1"){ 
                resultado = 1;
            }
            $(".item").removeClass("wrong");
            // mostrar capa de correcto o incorrecto
            id = elemento.attr("id");
            if (resultado == 1){
                //corecto
                //checks
                $("#feedback_" + id + " #acierto").css("display", "block");
               /*  $("#feedback_" + id + " #acierto").css("opacity", "1"); */
                $("#feedback_" + id + " #fallo").css("display", "none");
                //capas
                elemento.addClass("correct");
                $("#capaacierto").css("display", "block");
                $("#capafallo").css("display", "none");
                resultado = "1";
                $(".item").addClass("disabled");
                $(".item").removeAttr("tabindex");
                updateNav(curso.unidades[curso.currIndex], false);
            }
            else{
                //incorrecto
                //aspas
                $("#feedback_" + id + " #fallo").removeClass("check");
			    /* $("#feedback_" + id + " #fallo").css("opacity", "1"); */
                //capas
                elemento.addClass("wrong");
                $("#capafallo").css("display", "block");
                $("#capaacierto").css("display", "none");
                $("#fallotxt").remove();
                $("#capafallo").append("<div id='fallotxt'>" + feedbackfallo + "​</div>");
                resultado = "0";

            }
            
            if (isSessionLMS) {
                establecerAlturaScorm($(".contenido_scorm"), $(".subfoo.mostrar"));
            }
            // almacenar intento
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
        }
    }
});
