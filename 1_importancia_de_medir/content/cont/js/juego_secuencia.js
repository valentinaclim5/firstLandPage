var contador=0;
var seleccionActual= {id1:-1,id2:-1};

var contadorFallos = 0;
var contadorAciertos =0;
var arrayimg = [
    "<div class='enunciado10 flex_center_horiz'><div class='respuesta'></div></div>Análisis del problema: qué resultado quieres conseguir y qué datos necesitarás para ello.",
    "<div class='enunciado10 flex_center_horiz'><div class='respuesta'></div></div>Compilación y Prueba: al obtener el programa, prueba si todo funciona tal y como habías planeado.",
    "<div class='enunciado10 flex_center_horiz'><div class='respuesta'></div></div>Documentación y Mantenimiento: deja por escrito lo creado y permite que otros lointerpreten.",
    "<div class='enunciado10 flex_center_horiz'><div class='respuesta'></div></div>Diseño de la solución: diseña el algoritmo requerido para la solución, teniendo en cuenta las acciones necesarias.",
    "<div class='enunciado10 flex_center_horiz'><div class='respuesta'></div></div>Codificación: Convierte los pasos planificados en instrucciones."
];

var feedbackacierto = [
    "Has identificado la fase correcta. A continuación considera cuál es la segunda fase de programación y pulsa sobre ella​",
    "Has identificado la fase correcta. A continuación considera cuál es la tercera fase de programación y pulsa sobre ella​",
    "Has identificado la fase correcta. A continuación considera cuál es la cuarta fase de programación y pulsa sobre ella​",
    "Has identificado la fase correcta. A continuación considera cuál es la última fase de programación y pulsa sobre ella",
    "Has identificado correctamente el orden de las fases, pulsa \"siguiente\" para continuar con el curso"
];

var feedbackfallo = "No has identificado la fase correcta, vuelve a intentarlo.​";

//relacione el array de imgs, con la posicion de la foto con su correspondiente
var arraycorrectas = [0,3,4,1,2];

var pulsados = 0;
var contapuls = 0;
var pulsaciertos = 0;
var resetearWrong = false;
var resultado = "";

$(document).ready(function(){
    for (i = 0; i < arrayimg.length; i++) {
        var elems = "<button id='ele_"+i+"' class='juego_elem'>"+arrayimg[i]+"</button>";
        $(".juego_parejas").append(elems);
        $("#ele_"+i+" .respuesta").text(arraycorrectas[i]+1);
    };

    //al hacer click en un elemento
    $('.juego_elem').click(function(){
        if(!$(this).hasClass("correct")){
            $(".oculto").remove();
            $(".wrong").removeClass("wrong");
            var puls = $(this).attr("id");
            puls = parseInt(puls.substring(puls.indexOf("_")+1,puls.length));   
            if (puls==arraycorrectas[pulsaciertos]){
                $(this).addClass("correct");
                $(this).prop("disabled","true");
                $(".respuesta", this).addClass("mostrar");
                $("#capaacierto").css("display", "block");
                $("#capaacierto").html(feedbackacierto[pulsaciertos]);
                $("#capafallo").css("display", "none");
                pulsaciertos++;
            }
            else{
                $(this).addClass("wrong");
                $("#fallotxt").remove();
                $("#capafallo").append("<div id='fallotxt'>" + feedbackfallo + "​</div>");
                $("#capafallo").css("display", "block");
                $("#capaacierto").css("display", "none");

                // almacenar intento
                resultado = "0";
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
            pulsados[contapuls] = resultado;
            contapuls++;
            // Si se han pulsado todas
            if (pulsaciertos >= arraycorrectas.length){
                //si ha acertado todas se almacena intento con acierto
                
                if (pulsaciertos >= arraycorrectas.length){
                    //correcto
                   resultado = "1";
                    updateNav(curso.unidades[curso.currIndex], false);
                }
                
                if (isSessionLMS) {
                    establecerAlturaScorm($(".contenido_scorm"), $(".subfoo.mostrar"));
                }
                // almacenar intento
                resultado = "1";
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
});
