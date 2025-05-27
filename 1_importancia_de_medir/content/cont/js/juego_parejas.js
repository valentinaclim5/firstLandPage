/*
    En caso de añadir una imagen al juego solo es necesario añadir un td en HTML nuevo y la imagen en arrayimg
*/

var contador=0;
var seleccionActual= {id1:-1,id2:-1};

var contadorFallos = 0;
var contadorAciertos =0;
var arrayimg = [
    "<div class='enunciado10 flex_center_horiz'><div class='numero_pareja'>1</div><div class='respuesta'>&nbsp;- A</div></div>Piensa en qué quieres cocinar y qué ingredientes necesitarás para ello.",
    "<div class='enunciado10 flex_center_horiz'><div class='numero_pareja'>2</div><div class='respuesta'>&nbsp;- D</div></div>Planifica los pasos a seguir y los ingredientes para cada caso.",
    "<div class='enunciado10 flex_center_horiz'><div class='numero_pareja'>3</div><div class='respuesta'>&nbsp;- E</div></div>Realiza los pasos planificados, en el orden adecuado..",
    "<div class='enunciado10 flex_center_horiz'><div class='numero_pareja'>4</div><div class='respuesta'>&nbsp;- B</div></div>Tras la conversión de la masa en el bizcocho, prueba si te ha quedado como esperabas.",
    "<div class='enunciado10 flex_center_horiz'><div class='numero_pareja'>5</div><div class='respuesta'> - C</div></div>Guarda la receta.",
    "<div class='numero_pareja'>A</div>Análisis del problema: qué resultado quieres conseguir y qué datos necesitarás para ello.",
    "<div class='numero_pareja'>B</div>Compilación y Prueba: al obtener el programa, prueba si todo funciona tal y como habías planeado.",
    "<div class='numero_pareja'>C</div>Documentación y Mantenimiento: deja por escrito lo creado y permite que otros lointerpreten.",
    "<div class='numero_pareja'>D</div>Diseño de la solución: diseña el algoritmo requerido para la solución, teniendo en cuenta las acciones necesarias.",
    "<div class='numero_pareja'>E</div><br>Codificación: Convierte los pasos planificados en instrucciones.",
];

//relacione el array de imgs, con la posicion de la foto con su correspondiente
var arraycorrectas = [
{id1:0,id2:5},
{id1:1,id2:8},
{id1:2,id2:9},
{id1:3,id2:6},
{id1:4,id2:7},
];

var pulsados = [];
var contapuls = 0;
var resetearWrong = false;

$(document).ready(function(){
    for (i = 0; i < arrayimg.length; i++) {
        var elems = "<button id='ele_"+i+"' class='juego_elem'>"+arrayimg[i]+"</button>";
        $(".juego_parejas").append(elems);
        if (i==4){
            $(".juego_parejas").append("<div class='linea'></div>");
        }
    };

    //al hacer click en un elemento
    $('.juego_elem').click(function(){
        if(!$(this).hasClass("correct")){
            if (resetearWrong){
                $(".current").removeClass("current");
                $(".wrong").removeClass("wrong");
                resetearWrong = false;
            }
            //marcamos el elemento o lo desmarcamos   
            var puls = $(this).attr("id");
            puls = parseInt(puls.substring(puls.indexOf("_")+1,puls.length));  

            //marcamos el primer elemento
            if (contador==0){
                $(this).addClass("current");  
                seleccionActual["id1"] = puls; 
                contador++;
            }
            else if (contador==1){
                //desmarcamos
                if (puls == seleccionActual["id1"]){
                    $(this).removeClass("current");
                    seleccionActual["id1"] = -1;
                    contador--;
                }
                //marcamos el segundo elemento
                else{
                    $(this).addClass("current");  
                    seleccionActual["id2"] = puls;
                    contador = 0;
                    /************ */  
                    $(this).prop("disabled","true");  
                    $("#ele_" + seleccionActual["id1"]).prop("disabled","true");
                    resultado = 0;
                    for (var i = 0; i < arraycorrectas.length; i++) {
                        if (((arraycorrectas[i].id1 == seleccionActual["id1"]) && (arraycorrectas[i].id2 == seleccionActual["id2"])) || 
                        ((arraycorrectas[i].id1 == seleccionActual["id2"]) && (arraycorrectas[i].id2 == seleccionActual["id1"])) ){
                            resultado = 1;
                        } 
                    }
                    if (resultado>0){
                        $(this).addClass("correct");
                        $("#ele_" + seleccionActual["id1"]).addClass("correct");
                    }
                    else{
                        $(this).addClass("wrong");
                        $("#ele_" + seleccionActual["id1"]).addClass("wrong");
                    }
                    pulsados[contapuls] = resultado;
                    contapuls++;
                }
            }
            // Si se han pulsado todas
            if (contapuls >= arraycorrectas.length){
                // Comprobar si se han pulsado todas
                $(".juego_elem").removeAttr("disabled");
                var acertados = 0;
                $(".correct .respuesta").addClass("mostrar");
                for (var i = 0; i < pulsados.length; i++){
                    if(pulsados[i] == 1){
                        acertados++;
                    }
                }
                for (var i = 0; i < pulsados.length; i++){
                    if (i<acertados){
                        pulsados[i] = 1;
                    }
                    else{
                        pulsados[i] = 0;
                    }
                }
                contapuls = acertados;
                resetearWrong = true;
                //si ha acertado todas se muestra capa de aciertos si no la de fallos
                var resultado = "";
                if (acertados>=arraycorrectas.length){
                    //correcto
                    $("#capaacierto").css("display", "block");
                    $("#capafallo").css("display", "none");
                    resultado = "1";
                    updateNav(curso.unidades[curso.currIndex], false);
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
});
