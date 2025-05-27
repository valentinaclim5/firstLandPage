/* variables */


var feedbackfallo = $("#capafallo").text();
var feedbackacierto = $("#capaacierto").text();
var feedbacksiguiente = "Correcto, pulsa “Siguiente” para continuar";
var aciertos = 0;




$(document).ready(function () {

  /* captamos elmento change cuando cambia el select */
   $("select[id^='opciones_']").bind({
     change: function(e){
        var puls = $(this).attr("id");
        var puls = parseInt(puls.substring(puls.indexOf("_") + 1, puls.length));
        $("#feedback_" + puls + " #fallo").css("display", "none");/* reset para que no se vea */
       
         /* comparamos  si hay aciertos */
        if ($(this).val() == "1"){  
           aciertos++;
           
         /* mostrar correcto */
        $("#feedback_" + puls + " #acierto").css("display", "block");

        /* bloquea la respuesta correcta */
         $(this).prop("disabled", "true");

         /* mostrar mensaje correcto*/
         $("#capaacierto").css("display", "block");
         $("#capafallo").css("display", "none");
         
        /* saber que select estan con valor '1'*/
          var contaValor=0;
          $("select[ id^='opciones_' ]").each(function (index, element) {
            
            if ($(this).val()=='1') {
               contaValor++
            }

            if (contaValor == $("select[ id^='opciones_' ]").length) {
               $("#capaacierto").html(feedbacksiguiente);
               almacenarIntento('1');
               updateNav(curso.unidades[curso.currIndex], false);
            }
            
         }); 
         
          
        }else{ 

        $("#feedback_" + puls + " #fallo").css("display", "block");

        /* mostrar mensaje erroneo */
        $("#capaacierto").css("display", "none");
        $("#capafallo").css("display", "block");
        almacenarIntento("0");

        }
          if (isSessionLMS) {
             establecerAlturaScorm($(".contenido_scorm"), $(".subfoo.mostrar"));
          }
     } 

   });
   
   function almacenarIntento(resultado) {
      // almacenar intento
      var nuevo_intento = {};

      var fecha = new Date();
      var dformat =
         [fecha.getDate(), fecha.getMonth() + 1, fecha.getFullYear()].join(
            "/"
         ) +
         " " +
         [
            fecha.getHours(),
            (fecha.getMinutes() < 10 ? ":0" : ":") + fecha.getMinutes(),
            (fecha.getSeconds() < 10 ? ":0" : ":") + fecha.getSeconds(),
         ].join("");

      nuevo_intento["dt"] = dformat;
      nuevo_intento["nf"] = resultado;

      var competencia_unidad = curso.unidades[curso.currIndex].competence;
      var indice_pag_actual = curso.unidades[curso.currIndex].currIndex;
      var indice =
         seguim.vSegJSON[competencia_unidad]["pags"][indice_pag_actual]["in"]
            .length;
      seguim.vSegJSON[competencia_unidad]["pags"][indice_pag_actual]["in"][
         indice
      ] = nuevo_intento;

     /*  console.log(
         seguim.vSegJSON[competencia_unidad]["pags"][indice_pag_actual]["in"]
      ); */
   }   

  
}); 