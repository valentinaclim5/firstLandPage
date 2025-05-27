/// <reference path="jquery.d.ts" />
//Clases e interfaces de SCORM --------------------------------------------------------------------
var ISeguimiento = (function () {
    function ISeguimiento() {
    }
    return ISeguimiento;
})();

var courseCompletion = "incomplete";
var params = "toolbar=no,location=yes,directories=no,status=no,menubar=no,fullscreen=no,scrollbars=yes,resizable=yes";
var paramsAnalytics = ",width=555px,height=300px";
var beforeCompletion = "incomplete";
var progress = "0";
scormid = "";
var isSessionLMS = true;

var Seguimiento = (function () {
    function Seguimiento() {

        //seteamos el nuevo vector de puntuaciones con un JSON
        this.vSegJSON = {
        };
        this.puntoAbandono = {
            "unidad": 0,
            "pagina": 0,
            "NumTotalPags": 0
        };
        //vector que guarda los modulos que hay que habilitar, q vienen dados en el cmi.comments
        this.modulohabilitados = [];
        //nombre de la pagina y si se usa 1, si no 0
        this.bancoPreguntas = {};
        //Nombre del rasgo a randomizar
        this.nombreRasgoRandom = {};
        this.statusCurso = "incomplete";
        this.apiCorrecta = "false";
    }

    Seguimiento.prototype.readPuntoAbandono = function () {

        return JSON.stringify(this.puntoAbandono);
    };

    Seguimiento.prototype.writePuntoAbandono = function (str) {

        if (str != null && str != "") {
            this.puntoAbandono = jQuery.parseJSON(str);

        } else {
            // No hacemos nada, simplemente nos quedamos con el valor por defecto que tiene el vector vSegJSON
        }
    };

    Seguimiento.prototype.writeModulosHabilitados = function (str) {
        //Array 1
        var subcadena1 = str.substring(0, str.indexOf(";"));
        var vSubcadena1 = subcadena1.split(",");
        //var para enviar menos trazas
        var first_time = true;
        if (str != null && str != "") {
            for (var i = 0; i < vSubcadena1.length; i++) {
                /*@@@@@@@@@@@@@@@@@@@ INI - Alerts de control  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
                if (((vSubcadena1[i] == undefined) || (vSubcadena1[i] == "undefined")) && first_time) {
                    first_time = false;
                }
                /*@@@@@@@@@@@@@@@@@@@ FIN - Alerts de control  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
                //si no es undefined, se annade al vector 
                if ((vSubcadena1[i] != undefined) && (vSubcadena1[i] != "undefined")) {
                    this.modulohabilitados[i] = vSubcadena1[i];
                }

            }
        }
    };

    //lee/guarda los modulos que tenga el simulador en el XML de carga
    Seguimiento.prototype.readModulosHabilitados = function () {
        var string_cmicomments = "";
        //empezamos en 1 porque no cuenta el mod de bienvenida
        for (var i = 1; i < this.getLongitud(curso.unidades); i++) {
            var nombre = curso.unidades[i].nombre;
            ///var num_nombre = nombre.substring(nombre.length - 1, nombre.length);
            var num_nombre = nombre.substring(nombre.lastIndexOf(" ") + 1, nombre.length);
            string_cmicomments = string_cmicomments + num_nombre + ",";
        }

        //quitamos la coma final y añadimos un ; y un timestamp $.now()
        string_cmicomments = string_cmicomments.substring(0, string_cmicomments.length - 1);
        string_cmicomments = string_cmicomments + ";" + $.now();
        return string_cmicomments;
    };

    //convierte los Arrays a String -> convierte el obj JSON a string
    Seguimiento.prototype.readSeguimiento = function () {
        return JSON.stringify(this.vSegJSON);
    };

    //Convierte el string a Arrays  -> convierte el string JSON a OBJ JSON
    Seguimiento.prototype.writeSeguimiento = function (str) {
        if (str != null && str != "") {
            this.vSegJSON = jQuery.parseJSON(str);
        } else {
            // No hacemos nada, simplemente nos quedamos con el valor por defecto que tiene el vector vSegJSON
        }
    };

    //devuelve la clave de un Array a partir de un INDEX
    Seguimiento.prototype.getClave = function (index, vec) {
        var ind1 = 0;
        for (var v in vec) {
            if (index == ind1)
                return v;
            ind1++;
        }
        return null;
    };

    Seguimiento.prototype.getIndice = function (clave, vec) {
        var ind1 = 0;
        for (var v in vec) {
            if (v == clave)
                return ind1;
            ind1++;
        }
        return null;
    };

    Seguimiento.prototype.getLongitud = function (vec) {
        var ind1 = 0;
        for (var v in vec) {
            ind1++;
        }
        return ind1;
    };

    Seguimiento.prototype.setValue = function (clave, valor, vec) {
        if (vec == undefined) {
            vec = this.vPuntuaciones;
        }
        vec[clave] = valor;
    };

    //es la nota obtenida en el cuestionario de conocimiento de cada modulo
    Seguimiento.prototype.getNotaCurso = function (vec) {
        if (vec == undefined) {
            vec = this.vPuntuaciones;
        }

        var nota = 0;
        var pags = 0;
        for (var v in vec) {
            //si es cuestionario final entonces se validan las pregs si esa pagina de cuest tiene preguntas        
            if ((vec[v]["rg"] == "cuest") && (vec[v]["pr"] != undefined)) {
                pags++;
                //recorremos las pregs
                for (var y in vec[v]["pr"]) {
                    //si la respuesta es 1, sumamos a la nota
                    if (vec[v]["pr"][y]["nf"] == 1) {
                        nota++;
                    }

                }
            }
        }
        var nota_porcentaje = ((nota * 100) / pags) + "";
        return nota_porcentaje;
    };

    Seguimiento.prototype.getNumPregsRasgo = function (rasgo) {
        var num = 0;
        if (rasgo != "") {
            for (var i = 0; i < this.getLongitud(this.bancoPreguntas); i++) {
                var pregunta = this.getClave(i, this.bancoPreguntas);
                var rasgo_banco = pregunta.substring(0, pregunta.indexOf("_"));
                if (rasgo_banco == rasgo) {
                    num++;
                }
            }
        }
        return num;
    };

    Seguimiento.prototype.isCursoCompleto = function () {
        //Si esta completado el cuestionario el curso esta completado
        //var cuestionario = this.vSegJSON["cuestionario"]["pags"];   
        completado = true;
        for (elem in seguim.vSegJSON) {
            if (elem != "footerLinks" && elem != "ts") {
                for (elem_paginas in seguim.vSegJSON[elem]["pags"]) {
                    if (seguim.vSegJSON[elem]["pags"][elem_paginas]["vt"] == 0) {
                        completado = false;
                    }
                }
            }
        }
        return completado;
    };

    Seguimiento.prototype.getProgress = function () {
        num_visited_pages = 0;
        for (var comp in this.vSegJSON) {
            for (var pags in this.vSegJSON[comp]["pags"]) {
                if (this.vSegJSON[comp]["pags"][pags].vt == "1") {
                    num_visited_pages++;
                }
            }
        }

        var progreso = Math.round((num_visited_pages / this.puntoAbandono["NumTotalPags"]) * 100);
        /* window.opener.progress = progreso; */
    }

    //Funcion que indica si un modulo esta completado o no, dependiendo de si se han visitado todos sus páginas
    //Returns Boolean
    Seguimiento.prototype.isModuloCompletado = function (modID) {
        var isEnabled = false;

        var unidad_actual = curso.unidades[modID].competence;
        //si es el cuestionario la completitud del modulo es diferente, depende de sacar el 100%
        //miramos todas las paginas a ver si estan visitadas, si es asi, damos el mod por completado
        var todas_visitadas = true;
        //miramos todas las paginas del submodulo, si estan visitadas lo ponemos a completado
        for (var i = 0; i < seguim.getLongitud(this.vSegJSON[unidad_actual]["pags"]); i++) {
            if (this.vSegJSON[unidad_actual]["pags"][i].vt == "0") {
                todas_visitadas = false;
            }
        };
        if (todas_visitadas) {
            //entonces modulo completo
            isEnabled = true;
        }
        else {
            isEnabled = false;
        }

        return isEnabled;
    }

    //Funcion que indica si un Submodulo esta completado o no, dependiendo de si se la var de completitud del json
    // FA, FL, RE, AS, CC esta con valor 1, dependiendo de diferentes factores, dependiendo del modulo
    //Returns Boolean
    Seguimiento.prototype.isSubModuloEnabled = function (modID, subModID) {
        var isEnabled = false;
        //miramos la ultima pagina del modulo para ver si esta visitada
        var unidad_actual = curso.unidades[modID].competence;
        var todas_visitadas = true;
        //miramos todas las paginas del submodulo, si estan visitadas lo ponemos a completado
        for (var i = 0; i < seguim.getLongitud(this.vSegJSON[unidad_actual]["pags"]); i++) {
            if (this.vSegJSON[unidad_actual]["pags"][i].rg == subModID) {
                if (this.vSegJSON[unidad_actual]["pags"][i].vt == "0") {
                    todas_visitadas = false;
                }
            }
        };
        if (todas_visitadas) {
            //entonces submodulo completo
            this.vSegJSON[unidad_actual][subModID] = "1";
            isEnabled = false;
        }
        else {
            isEnabled = true;
        }

        return isEnabled;
    }

    Seguimiento.prototype.abrirComunicacion = function () {
        this.apiCorrecta = doLMSInitialize();
        iniciarTiempo();
        if (this.apiCorrecta == "true") {
            this.statusCurso = doLMSGetValue("cmi.core.lesson_status");
            if (this.statusCurso != "completed") {
                if (this.statusCurso !== ""){
                    this.statusCurso = "incomplete";
                }
            }
            /* window.opener.beforeCompletion = this.statusCurso; */
            // Recupera el punto de abandono
            this.writePuntoAbandono(doLMSGetValue("cmi.core.lesson_location"));

            // Recupera el vector de seguimiento de las ventanas del curso
            this.writeSeguimiento(doLMSGetValue("cmi.suspend_data"));

            //Recuperamos el campo launch, con la informacion de los modulos a cargar
            this.writeModulosHabilitados(doLMSGetValue("cmi.comments"));

            // Inicia el tiempo de sesion
            iniciarTiempo();
        } else {
            //Es offline si 0 y es online si 1, si hasSCORM=1 ONLINE, si hasSCORM=0 OFFLINE
            var isOnline = curso.getScorm();
            if (isOnline == 1) {
                $("#error_api").css("display", "block");
                var windowWidth = $(window).width();

                //si la resolucion es menor de 968, utilizamos 100% de pantalla para el POP UP
                if (windowWidth < 961) {
                    $.colorbox({ inline: true, href: "#error_api", className: "pagin_fin", overlayClose: false, escKey: false, closeButton: false, width: "100%", maxWidth: "100%" });
                }
                else {
                    $.colorbox({ inline: true, href: "#error_api", className: "pagin_fin", overlayClose: false, escKey: false, closeButton: false, width: "60%", maxWidth: "100%" });
                }

            }
        }
        //this.puntoAbandono["NumTotalPags"] = 3;
        //this.writeModulosHabilitados("2,4,6;C_000000_0000");

    }

    Seguimiento.prototype.despacharPagina = function () {
        //console.log(apiCorrecta);
        if (isSessionLMS ) {
            //@@@ Este codigo despacha a la pagina que tiene que ir, dependiendo del punto de abandono
            //hay que definir la unidad y la pagina del curso
            //Creamos una pagina
            //this.writePuntoAbandono("1,2,3");
            //recuperamos el INDICE de la UNIDAD
            // Recupera el vector de seguimiento de las ventanas del curso
            this.writeSeguimiento(doLMSGetValue("cmi.suspend_data"));
        }
        else {
            //Es offline si 0 y es online si 1, si hasSCORM=1 ONLINE, si hasSCORM=0 OFFLINE
            var isOnline = curso.getScorm();
            if (isOnline == 1) {
                $("#error_api").css("display", "block");
                var windowWidth = $(window).width();

                //si la resolucion es menor de 968, utilizamos 100% de pantalla para el POP UP
                if (windowWidth < 961) {
                    $.colorbox({ inline: true, href: "#error_api", className: "pagin_fin", overlayClose: false, escKey: false, closeButton: false, width: "100%", maxWidth: "100%" });
                }
                else {
                    $.colorbox({ inline: true, href: "#error_api", className: "pagin_fin", overlayClose: false, escKey: false, closeButton: false, width: "60%", maxWidth: "100%" });
                }
            }
        }
        //PARA PROBAR EL PUNTO DE ABANDONO
        //this.writePuntoAbandono('{"unidad":6,"pagina":3,"NumTotalPags":10}');

        curso.currIndex = parseInt(this.puntoAbandono["unidad"]);

        //recuperamos el INDICE de la PAGINA
        curso.unidades[curso.currIndex].currIndex = parseInt(this.puntoAbandono["pagina"]);

        //@@@@ SI EL PUNTO DE ABANDONO QUEDO EN UNA DE LAS PÁGINAS DE CUESTIONARIO
        //RETORNAMOS A LA 2 PAGINA DE INICIO DEL CUESTIONARIO, UNIDAD=CUESTIONARIO
        //SOLO LO HACEMOS PARA LAS PREGUNTAS, EL RESTO DE PAGINAS DEL CUESTIONARIO VUELVEN A ELLAS MISMAS

        if (curso.unidades[curso.currIndex].competence == "cuestionario") {
            //si el rasgo es cuest significa que es una pregunta y se vuelve a la segunda pagina
            if (curso.unidades[curso.currIndex].paginas[curso.unidades[curso.currIndex].currIndex].rasgo == "cuest") {
                //para volver a la segunda pagina cuyo rasgo = "intro2"
                loadSubUnit(curso.currIndex, "intro2");
            }
        }

        var pagina = new Pagina();
        var unidad_actual = curso.unidades[curso.currIndex].competence;
        pagina.url = this.vSegJSON[unidad_actual]["pags"][curso.unidades[curso.currIndex].currIndex].url;

        updatePagina();
    };

    Seguimiento.prototype.guardarComunicacion = function () {
        if (isSessionLMS ) {
            // Almacena el tiempo empleado en esta sesion
            /* doLMSSetValue("cmi.core.session_time", getTiempoFormateado()); */
            // Almacena el vector de seguimiento de las ventanas
            var username = doLMSGetValue("cmi.core.student_id");
            var scormid = getScormId();
            doLMSSetValue("cmi.suspend_data", this.readSeguimiento());
            doLMSSetValue("cmi.core.lesson_location", this.readPuntoAbandono());

            //guardamos en el cmi.comments los modulos del simulador si viene vacio el propio cmi.comments,
            //si no nos quedamos con los modulos que ya tenía
            if (seguim.getLongitud(seguim.modulohabilitados) == 0) {//si viene vacio cmi.comments
                this.readModulosHabilitados();
            }

            //para pedir el estado del scorm a LMS
            var url2 = location.protocol + "//" + location.host + "/local/scorm_manager/ajax.php/?action=getscormstatus&username=" + username + "&scormid=" + scormid + "&rqhs=wss2scourseb10343b7618f";

            $.ajax({
                url: url2,
                cache: false,
                type: "GET",
                contentType: "application/json",
                success: function (data) {

                    //miramos el estado si es distinto de 2 = completado
                    // 1 = incompleto
                    //0 = no iniciado
                    // -1 == error
                    if(data.status=="0"){
                        doLMSSetValue("cmi.core.lesson_status", "incomplete");
                    }    
                    else if(data.status=="2"){
                        doLMSSetValue("cmi.core.lesson_status", "completed");
                    }               

                    if (seguim.isCursoCompleto()) {
                        doLMSSetValue("cmi.core.lesson_status", "completed");
                        seguim.statusCurso = "completed";
                        // se envia el status del curso a index.html
                        courseCompletion = this.statusCurso;
                    }
                    // se calcula el progreso por medio de esta funcion, que lo enviara a index.html
                    seguim.getProgress();

                    if (doLMSGetValue("cmi.core.lesson_status") != "completed") {
                        doLMSSetValue("cmi.core.exit", "suspend");
                    } else {
                        doLMSSetValue("cmi.core.exit", "");
                    }
                    // Finaliza la comunicacion
                    var resultCommit = doLMSCommit();
                    if (resultCommit == "false") {
                        //alert(vAlerts["txt_api_lost_error_finish"]);
                    }
                    else {
                        //WebService
                        if (seguim.isCursoCompleto()) {
                            // Al completar el curso llamamos a un web service y le enviamos el username de moodle
                            
                            var url = location.protocol + "//" + location.host + "/cclearning/courses2s/courses2s_completions/username/" + username + "/scormid/" + scormid + "/?usecas=0&requester=wss2scourseb10343b7618f";

                            $.ajax({
                                url: url,
                                cache: false,
                                type: "GET",
                                contentType: "application/json",
                                success: function (data) {
                                },
                                error: function (xhr, status) {
                                    /* seguim.sendDebug("Error completitud curso al llamar al webservice courses2s/courses2s_completions: scormid=" + scormid + " username=" + username + " xhr=" + xhr.responseText + " status=" + status); */
                                }
                            });
                        }
                    }

                },
                error: function (xhr, status) {
                    console.log("error recuperar estado del curso");
                    $("#error_api").css("display", "block");
                    var windowWidth = $(window).width();

                    //si la resolucion es menor de 968, utilizamos 100% de pantalla para el POP UP
                    if (windowWidth < 961) {
                        $.colorbox({ inline: true, href: "#error_api", className: "pagin_fin", overlayClose: false, escKey: false, closeButton: false, width: "100%", maxWidth: "100%" });
                    }
                    else {
                        $.colorbox({ inline: true, href: "#error_api", className: "pagin_fin", overlayClose: false, escKey: false, closeButton: false, width: "60%", maxWidth: "100%" });
                    }
                }
            });

            
        }
        else {
            //Es offline si 0 y es online si 1, si hasSCORM=1 ONLINE, si hasSCORM=0 OFFLINE
            var isOnline = curso.getScorm();
            if (isOnline == 1) {
                $("#error_api").css("display", "block");
                var windowWidth = $(window).width();

                //si la resolucion es menor de 968, utilizamos 100% de pantalla para el POP UP
                if (windowWidth < 961) {
                    $.colorbox({ inline: true, href: "#error_api", className: "pagin_fin", overlayClose: false, escKey: false, closeButton: false, width: "100%", maxWidth: "100%" });
                }
                else {
                    $.colorbox({ inline: true, href: "#error_api", className: "pagin_fin", overlayClose: false, escKey: false, closeButton: false, width: "60%", maxWidth: "100%" });
                }
            }
        }
    };

    Seguimiento.prototype.cerrarComunicacion = function () {
        if (isSessionLMS ) {
            // Almacena el tiempo empleado en esta sesion
            doLMSSetValue("cmi.core.session_time", getTiempoFormateado());
            // ts = tiempo de cada sesión
            seguim.vSegJSON["ts"].push(getTiempoFormateado());
            // Almacena el vector de seguimiento de las ventanas
            doLMSSetValue("cmi.suspend_data", this.readSeguimiento());

            // Almacena el resultado del test de evaluacion
            //doLMSSetValue("cmi.core.score.raw",scoreCurso);
            // Almacena el punto de abandono
            doLMSSetValue("cmi.core.lesson_location", this.readPuntoAbandono());

            //guardamos en el cmi.comments los modulos del simulador si viene vacio el propio cmi.comments,
            //si no nos quedamos con los modulos que ya tenía
            if (seguim.getLongitud(seguim.modulohabilitados) == 0) {//si viene vacio cmi.comments
                this.readModulosHabilitados();
            }

            if (this.isCursoCompleto()) {
                doLMSSetValue("cmi.core.lesson_status", "completed");
                this.statusCurso = "completed";
                // se envia el status del curso a index.html
                courseCompletion = this.statusCurso;
            }
            // se calcula el progreso por medio de esta funcion, que lo enviara a index.html
            this.getProgress();

            if (doLMSGetValue("cmi.core.lesson_status") != "completed") {
                doLMSSetValue("cmi.core.exit", "suspend");
            } else {
                doLMSSetValue("cmi.core.exit", "");
            }

            // Finaliza la comunicacion
            var resultCommit = doLMSCommit();
            if (resultCommit == "false") {
                //alert(vAlerts["txt_api_lost_error_finish"]);
            }
            if (beforeCompletion != "completed") {
                openPopUp();
            }
            doLMSFinish();
        }
        else {
            //Es offline si 0 y es online si 1, si hasSCORM=1 ONLINE, si hasSCORM=0 OFFLINE
            var isOnline = curso.getScorm();
            if (isOnline == 1) {
                $("#error_api").css("display", "block");

                var windowWidth = $(window).width();
                //si la resolucion es menor de 968, utilizamos 100% de pantalla para el POP UP
                if (windowWidth < 961) {
                    $.colorbox({ inline: true, href: "#error_api", className: "pagin_fin", overlayClose: false, escKey: false, closeButton: false, width: "100%", maxWidth: "100%" });
                }
                else {
                    $.colorbox({ inline: true, href: "#error_api", className: "pagin_fin", overlayClose: false, escKey: false, closeButton: false, width: "60%", maxWidth: "100%" });
                }
            }
        }
    };
    return Seguimiento;
})();

//Classes ----------------------------------------------------------------------------------------------------------
//Curso
var Curso = (function () {
    function Curso(mytitle) {
        this.currIndex = 0;
        this.unidades = [];
        this.titulo = mytitle;
        //Por defecto es un un curso scorm, es decir para reproducir online, y no offline
        this.hasScorm = "1";
    }
    Curso.prototype.getTitulo = function () {
        return this.titulo;
    };

    Curso.prototype.getScorm = function () {
        return this.hasScorm;
    };

    Curso.prototype.addUnidad = function (unidad) {
        this.unidades.push(unidad);
    };
    return Curso;
})();

var Unidad = (function () {
    function Unidad() {
        this.currIndex = 0;
        this.paginas = [];
        this.nombre = "";
        this.available = "";
        this.type = "";
        //en este caso competence = momento
        this.competence = "";
        //en este caso rasgos = actividades
        this.rasgos = [];
        //si esta disable no se puede ni pulsar
        this.disabl = "";
        //si tiene que aparecer o no en el menu
        this.hasmenu = "";
    }
    Unidad.prototype.addPagina = function (pagina) {
        this.paginas.push(pagina);
    };
    //annadimos los rasgos solo si no estan ya en el array
    Unidad.prototype.addRasgos = function (rasgo, nombre, hassubmenu) {
        var rasgo_existe = false;
        for (var i = 0; i < this.rasgos.length; i++) {
            if (rasgo == this.rasgos[i].rasgo) {
                rasgo_existe = true;
            }
        }
        if (!rasgo_existe && rasgo != "") {
            var object_rasgo = {
                "rasgo": rasgo,
                "nombre": nombre,
                "hassubmenu": hassubmenu
            };
            this.rasgos.push(object_rasgo);
        }
    };

    Unidad.prototype.loadNextPage = function () {
        //si no es la ultima pagina del curso pasamos de pagina
        if (!(curso.currIndex == curso.unidades.length - 1) || !(this.currIndex == this.paginas.length - 1)) {
            if (this.currIndex < this.paginas.length - 1) {
                this.currIndex++;
            } else {
                //Avanzamos de modulo si hay uno disponible - NO SE AVANZA.
                openNextModule();
            }
            updatePagina();
        }
        else {
            //console.log("no pasa de pagina");
        }
    };

    Unidad.prototype.loadPrevPage = function () {
        if (this.currIndex != 0) {
            this.currIndex--;
        } else {
            openPrevModule();
        }
        updatePagina();
    };

    /*funcion para deshabilitar next o hablitar si viene la variable habilitar informada*/
    /*true = deshabilitado boton next*/
    /*false = habilitado boton next*/
    Unidad.prototype.getNextDisabled = function (habilitar) {
        if (habilitar == undefined) {
            //miramos la pagina actual
            var pagina = this.paginas[this.currIndex];
            //miramos si esta bloqueada el boton next, por el XML
            //si false esta desbloqueado, si true bloqueado
            var next_bloqueado = pagina.nxt;
            /*************ini: es opcional********************************************/
            //miramos tb si la pagina siguiente ya se ha visitado para poder tener habilitado dicho contenido
            //solo si no estamos en la ultima pagina
            //se guarda el indice de la pag siguiente
            var pag_siguiente = "";
            var competencia = this.competence;
            //si no es la ultima pagina de la competencia avanzamos a la siguiente
            if ((this.currIndex + 1) < seguim.getLongitud(this.paginas)) {
                pag_siguiente = this.currIndex + 1;
            }
            //si es la ultima pagina, miramos la primera pagina de la siguiente competencia o modulo
            else {
                //miramos la siguiente competencia siempre y cuando exista porque no es la ultima
                if (parseInt(this.curso.currIndex + 1) < seguim.getLongitud(this.curso.unidades)) {
                    //pasamos a la siguiente competencia
                    competencia = this.curso.unidades[parseInt(this.curso.currIndex + 1)].competence;
                    pag_siguiente = 0;
                }
                else {
                    //si no existe una siguiente competencia, lo dejamos igual
                    competencia = this.competence;
                    pag_siguiente = this.currIndex;
                }

            }
            var pag_visitada = false;
            //si esta visitada la pagina la habilitamos
            if (seguim.vSegJSON[competencia]["pags"][pag_siguiente].vt == "1") {
                pag_visitada = true;
            }

            /**************fin: es opcional*******************************************/
            var next_bloqueo_requerido = pagina.bloqueo_requerido;
            //habilitado
            if ((!next_bloqueado) || ((pag_visitada) && (!next_bloqueo_requerido))) {
                return false;
                //deshabilitado el boton next
            } else {
                //return this.currIndex == this.paginas.length - 1;
                return true;
            }
        }
        else {
            //siempre habilitamos
            return false;
        }


    };

    Unidad.prototype.getPrevDisabled = function () {
        //miramos la pÃ¡gina actual
        var pagina = this.paginas[this.currIndex];
        //miramos si esta bloqueada el botÃ³n previous, por el json
        //si false esta desbloqueado, si true bloqueado
        var prev_bloqueado = pagina.prv;
        //siempre que sea la primera pagina se bloquea o se requiera
        if ((this.curso.currIndex <= 0) || (prev_bloqueado)) {
            return true;//bloqueado
        } else {
            return false;
        }
    };
    return Unidad;
})();

var Pagina = (function () {
    function Pagina() {
        this.random = "0";
        this.url = "";
        this.available = true;
        this.type = "";
        //guarda el rasgo, igual al de moodle
        this.rasgo = "";
        //guarda el tipo de pregunta: situacional, objetiva, deseabilidad o azar
        this.type_preg = "";
        //guarda el tipo de contenido de la pregunta: necesario para algoritmo de LMS
        this.type_cont = "";
        //factor de ponderacion para guardar la nota final
        this.ponderacion = "1";
        //pagina visitada
        this.visitada = "0";
        //bloque requerido para el next, aunque ya hayamos visto esta pagina, el next siempre permanece bloqueado
        this.bloqueo_requerido = "";
        //nombre del submodulo asociado
        this.nombre = "";
        //si va a tener boton clickable el submenu
        this.hassubmenu = "";
    }
    return Pagina;
})();

//--- IMPLEMENTACION ----------------------------------------------------------------------------------------
var curso;
var seguim;
var $loader;
//var done = true;
var error_conection = false;

/**
* Esta funcion lee el JSON de datos del curso.
*/
function readCourse() {
    $loader = $("<div class='pageloader'>" + loading + "<img src='img/loader.gif' alt='" + loading + "'></img></div>");
    seguim = new Seguimiento();
    $.ajax({
        url: 'course.json',
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            var $json = json.course;
            curso = new Curso(json.courseTitle);
            curso.hasScorm = $json.hasSCORM;
            if (curso.hasScorm == 0) {
                //alert(error_hasScorm);
            }

            //recorremos las unidades
            $.each($json.contents, function (idx, unit) {
                //recorremos las paginas de cada unidad
                $.each(unit.pages, function (idx2, page) {
                    //si es una pagina random la annadimos al banco de preguntas
                    if (page.random == "1") {
                        rasgo_paginas = page.numpages;
                        var id_pag = page.id;
                        if (rasgo_paginas == undefined) {
                            rasgo_paginas = 0;
                            //alert(error_numpages + rasgo);
                        } else {
                            for (i = 1; i <= rasgo_paginas; i++) {
                                seguim.bancoPreguntas[id_pag + "_" + i] = 0;
                            }
                        }
                    }
                });
            });

            // IVAN
            seguim.abrirComunicacion();
            seguim.puntoAbandono["NumTotalPags"] = 0;
            //esta variable guarda el indice para el vector de las preguntas elegidas en el random
            var indice_paginas = 0;

            //Annadimos tantas unidades como unidades veamos en el json
            $.each($json.contents, function (idx, unit) {
                var unidad = new Unidad();
                unidad.curso = curso;
                unidad.nombre = unit.title;
                unidad.available = stringToBool(unit.available);
                unidad.type = unit.type;
                unidad.competence = unit.competence;
                unidad.disabl = stringToBool(unit.disabl);
                unidad.hasmenu = unit.hasmenu;

                //creamos la competencia vacia de momento, solo con el nombre, siempre y cuando no exista en el vector vSegJSON
                if (seguim.getIndice(unidad.competence, seguim.vSegJSON) == null) {
                    seguim.vSegJSON[unidad.competence] = {};
                    seguim.vSegJSON[unidad.competence]["pags"] = {}
                    seguim.vSegJSON[unidad.competence].title = unidad.nombre;
                }
                // ts = tiempo de cada sesión
                seguim.vSegJSON["ts"] = [];
                seguim.vSegJSON["footerLinks"] = {};
                $(".btn_subfoo").each(function (index) {
                    var clavelink = $(this).attr("data-clave");
                    seguim.vSegJSON["footerLinks"][clavelink] = {};
                    seguim.vSegJSON["footerLinks"][clavelink]["tl"] = 0;
                    if ($(this).hasClass("parent")) {
                        seguim.vSegJSON["footerLinks"][clavelink]["sn"] = {};
                        $("." + $(this).attr("data-clave")).each(function (index) {
                            seguim.vSegJSON["footerLinks"][clavelink]["sn"][$(this).attr("id")] = 0;
                        });
                    }

                });
                //creamos una posicion para alamacenar el tiempo de cada sesion

                //num pages de la unidad
                var num_pages_unidad = 0;
                $.each(unit.pages, function (idx2, page) {
                    //sacamos el rasgo y si es random del JSON de page
                    var rasgo = page.id;
                    var rasgo_paginas = seguim.getNumPregsRasgo(rasgo);
                    var pregunta_random = page.random;

                    //variable para controlar si hay que crear la pagina y meter su informacion
                    var crear_pagina = false;

                    //@@@@ elegimos aleatoriamente una pagina del rasgo
                    //Solo si es la 1 vez que ejecutamos el curso
                    //if (seguim.getPagMasAvanzada()<=1)
                    if ((seguim.puntoAbandono["unidad"] == 0) &&
                        (seguim.puntoAbandono["pagina"] == 0)) {
                        //creamos la pagina
                        var pagina = new Pagina();
                        pagina.random = pregunta_random;
                        crear_pagina = true;
                        num_pages_unidad++;

                        if (pregunta_random == "1") {
                            var parar = false;
                            //recorremos el banco de preguntas y elegimos de manera aleatoria una pagina
                            for (var i = 0; parar != true; i++) {
                                //hacemos el random del numero de pregs aleatorias que tenga el rasgo
                                var num_aleatorio = Math.floor((Math.random() * rasgo_paginas) + 1);
                                //guardamos la pregunta randomizada del rasgo                              
                                var rasgo_banco_preg = rasgo + "_" + num_aleatorio;
                                //guardamos el rasgo de la pregunta
                                var rasgo_banco = rasgo_banco_preg.substring(0, rasgo_banco_preg.indexOf("_"));
                                //miramos si esta usada dicha pregunta
                                var rasgo_banco_usado = seguim.bancoPreguntas[rasgo_banco_preg];
                                if ((rasgo == rasgo_banco) && (rasgo_banco_usado == 0)) {
                                    //marcamos a usada la pregunta
                                    seguim.bancoPreguntas[rasgo_banco_preg] = 1;
                                    //actualizamos el html a cargar
                                    var url = rasgo_banco_preg + ".html";
                                    parar = true;
                                }
                            }
                            pagina.url = url;
                        }
                        //si no es RANDOM
                        else {
                            pagina.url = page.src;
                        }
                        //si es la primera vez que entra se comprueba que el lesson status del scorm no este a completo
                        var stat = doLMSGetValue("cmi.core.lesson_status");
                        if (stat!=="completed"){
                            //seteamos el status a imcomplete la primera vez que se entra en el curso
                            if (stat!=="")
                            {
                                //doLMSSetValue("cmi.core.lesson_status", "incomplete");
                            }
                        }
                    }
                    //si no es la 1 vez que entramos al curso
                    else {
                        crear_pagina = false;
                        //si es random recuperamos del JSON
                        if (pregunta_random == "1") {
                            num_pages_unidad++;
                            //RECUPERAMOS DEL JSON la pagina
                            var pag_scorm = seguim.vSegJSON[unidad.competence]["pags"][num_pages_unidad - 1].url;

                            //creamos la pagina
                            var pagina = new Pagina();
                            //recuperamos las paginas que habiamos randomizado
                            pagina.url = pag_scorm;
                            pagina.random = pregunta_random;

                            crear_pagina = true;

                        }
                        //si no es random recuperamos del JSON
                        else {
                            //creamos la pagina
                            var pagina = new Pagina();
                            pagina.url = page.src;

                            crear_pagina = true;
                            num_pages_unidad++;
                        }

                    }
                    //si existe la posicion en el vector, annadimos su info
                    if (crear_pagina) {
                        //creamos la pagina vacio de momento, solo con el num de pag por competencia,
                        // siempre y cuando no exista en el vector vSegJSON
                        if (seguim.getIndice(num_pages_unidad - 1, seguim.vSegJSON[unidad.competence]["pags"]) == null) {
                            seguim.vSegJSON[unidad.competence]["pags"][num_pages_unidad - 1] = {};
                        }

                        pagina.available = stringToBool(page.available);
                        //atributos para saber si los botones de navegacion next o prev estan bloqueados
                        pagina.nxt = stringToBool(page.nxt);
                        pagina.prv = stringToBool(page.prv);
                        if (page.hn != undefined) {
                            pagina.hn = stringToBool(page.hn);
                        }
                        if (page.hp != undefined) {
                            pagina.hp = stringToBool(page.hp);
                        }
                        //bloqueo de next requerido siempre
                        pagina.bloqueo_requerido = stringToBool(page.reqBlock);
                        //si va a tener boton pulsable en el submenu
                        if (page.hassubmenu == undefined) {
                            pagina.hassubmenu = "";
                        }
                        else {
                            pagina.hassubmenu = page.hassubmenu;
                        }
                        //nombre de la subactividad
                        if (page.nombre == undefined) {
                            pagina.nombre = "";
                        }
                        else {
                            pagina.nombre = page.nombre;
                        }
                        //guardamos el nombre del rasgo
                        seguim.nombreRasgoRandom[indice_paginas] = {}
                        seguim.nombreRasgoRandom[indice_paginas]["unidad"] = unidad.competence;
                        seguim.nombreRasgoRandom[indice_paginas]["pagina"] = num_pages_unidad - 1;
                        seguim.nombreRasgoRandom[indice_paginas]["nombre"] = rasgo;

                        // rasgo de la pagina
                        //guardamos el rasgo
                        if (page.rasgo == undefined) {
                            pagina.rasgo = "";
                        }
                        else {
                            pagina.rasgo = page.rasgo;
                            seguim.vSegJSON[unidad.competence][pagina.rasgo] = "0";
                        }

                        //guardamos los rasgos o actividades, para tener un array con todos ellos
                        //solo si va a ir en el menu (es decir, nomenu undefined o 0)
                        if (page.nomenu != "1") {
                            unidad.addRasgos(pagina.rasgo, pagina.nombre, pagina.hassubmenu);
                        }
                        //console.log(unidad.rasgos);

                        //el rasgo de la pagina
                        seguim.vSegJSON[unidad.competence]["pags"][num_pages_unidad - 1]["rg"] = pagina.rasgo;
                        //la url de la pagina
                        seguim.vSegJSON[unidad.competence]["pags"][num_pages_unidad - 1]["url"] = pagina.url;
                        //la pagina si esta visitada
                        seguim.vSegJSON[unidad.competence]["pags"][num_pages_unidad - 1]["vt"] = pagina.visitada;

                        // si la pagina habia sido visitada no le cambiamos el estado
                        if (seguim.vSegJSON[unidad.competence]["pags"][num_pages_unidad - 1]["vt"] != "1") {
                            seguim.vSegJSON[unidad.competence]["pags"][num_pages_unidad - 1]["vt"] = "0";
                        }
                        //si es random o tiene pregunta annadimos al vector de puntuaciones 
                        if (page.hasPreg == undefined) {
                            pagina.hasPreg = "";
                        }
                        else {
                            pagina.hasPreg = page.hasPreg;
                        }

                        if (pagina.random == "1" || pagina.hasPreg == "1") {
                            //Si es una pregunta entonces añadimos un vector de preguntas de la pagina
                            /*  seguim.vSegJSON[unidad.competence]["pags"][num_pages_unidad-1]["pr"] = {}; */

                            //guardamos el type de preg, habrá tantos como nums de pregs tenga la pagina
                            pagina.type_preg = page["type-preg"];

                            //guardamos el factor de ponderacion
                            pagina.ponderacion = page.ponderacion;
                            seguim.vSegJSON[unidad.competence]["pags"][num_pages_unidad - 1]["in"] = new Array();
                            seguim.vSegJSON[unidad.competence]["pags"][num_pages_unidad - 1]["tp"] = page["type-preg"];
                            //se rellenará el JSON VACÍO, y las notas se irán incluyendo en cada página segun el type_preg, 
                            //solo creamos la estructura inicial
                            /* var num_pregs_array = pagina.type_preg.split(","); */
                            //sacamos el array de tipo de pregs, coincidará con el numero de typepregs
                            /* for(var i = 0; i < num_pregs_array.length; i++) { */
                            //creamos el objeto con las notas de la pagina, pueden ser 1 o N
                            /* seguim.vSegJSON[unidad.competence]["pags"][num_pages_unidad-1]["pr"][i] = {}; */
                            //respuesta, de momento vacia
                            /* seguim.vSegJSON[unidad.competence]["pags"][num_pages_unidad-1]["pr"][i]["rp"] = ""; */
                            //nota final, de momento vacia
                            /* seguim.vSegJSON[unidad.competence]["pags"][num_pages_unidad-1]["pr"][i]["nf"] = ""; */
                            //tipo pregunta
                            /* seguim.vSegJSON[unidad.competence]["pags"][num_pages_unidad-1]["pr"][i]["tp"] = num_pregs_array[i]; */
                            /* seguim.vSegJSON[unidad.competence]["pags"][num_pages_unidad-1]["pr"][i]["in"] = ""; */
                            /* seguim.vSegJSON[unidad.competence]["pags"][num_pages_unidad-1]["pr"][i]["fc"] = ""; */
                            /* }     */
                        }
                        if (page.video != undefined) {
                            seguim.vSegJSON[unidad.competence]["pags"][num_pages_unidad - 1]["vd"] = page.video;
                        }
                        //annadimos la pagina a la unidad
                        unidad.addPagina(pagina);
                        indice_paginas++;
                        seguim.puntoAbandono["NumTotalPags"]++;
                    }
                });
                //si tiene paginas se annade la unidad
                if (num_pages_unidad > 0) {
                    curso.addUnidad(unidad);
                }
            });
            updateInterfaz(curso);
        },
        error: function (xhr, status) {
            alert(loadError);
        },
        complete: function (xhr, status) {
            //IVAN - CONECTAMOS CON EL SCORM
            seguim.despacharPagina();
        }
    });
}

function updateInterfaz(curso) {
    this.curso = curso;
    // $(".courseTitle").html(curso.titulo);
    //Para la version OFFLINE - Si cmi.comments viene vacio
    if (seguim.getLongitud(seguim.modulohabilitados) == 0) {
        //Pintar menu dinamicamente, si la unidad es available
        var menu = "";
        var mod_disable = "";
        var mod_menulink_disable = "";

        for (var i = 0; i < curso.unidades.length; i++) {
            if (curso.unidades[i].disabl) {
                mod_disable = "disabl";
                mod_menulink_disable = "disabled";
            }
            else {
                mod_disable = "";
                mod_menulink_disable = "";
            }
            if ((curso.unidades[i].available)) {
                /*   menu = menu + "<li data-toggle='collapse' data-parent='#accordion' href='#"+curso.unidades[i].competence+"' class='moment panel panel-default "+mod_disable+"' data-mod='"+i+"' role='menuitemradio' aria-checked='false' aria-disabled='false'><div class='panel-heading'>"
                     +"<button data-id='" + i + "' class= 'menulink firstOpen' aria-disabled='false' title='" + curso.unidades[i].nombre + " '"+mod_menulink_disable+"> <div class='logomenu'></div><div class='logomenu_text'>" + curso.unidades[i].nombre + "</div></button></div>"
                         +"<div id='"+curso.unidades[i].competence+"' class='panel-collapse collapse'><div class='panel-body'>"
                                 +"<div class='momen_collap'>";
      */
                menu = menu + "<li data-mod='" + i + "' role='menuitemradio' aria-checked='false' aria-disabled='false'>";
                if (i != 1) {
                    menu = menu + "<div class='trayecto'></div>"; // La primera linea no queremos pintarla

                }

                menu = menu + "<button data-id='" + i + "' class= 'menulink' disabled aria-disabled='true'><div class='logomenu " + curso.unidades[i].type + "' title=" + title[curso.unidades[i].type] + "></div><div class='textomenu'>" + curso.unidades[i].nombre + "</div></button></li>";

                /*  menu = menu + "</div></div></div></li>";     */
            }
        }
        $("#navigationMenu ul").append(menu);

        // Si el curso está offline el menu se deja desbloqueado para facilitar la revision

        var isOnline = curso.getScorm();

        if (isOnline == 0) {

            $("#menu_container ul li button").prop("disabled", false);

        }
    }

    //***********************************NAVEGACION************************************
    $(".ant").on("click", function () {
        //var creada en el index para distinguir entre pulsar el boton avance/atras o hacer pan con el dedo
        direction = "";
        prevPage();
    });
    $(".sig").on("click", function () {
        direction = "";
        //console.log("entra");
        nextPage();
    });

    $(".menulink").bind("click", function (e) {
        e.preventDefault();
        direction = "";

        loadUnit($(this).data("id"));
        //si esta abierto el menu bloqueamos su uso, para que no se pueda cerrar
        //si es la primera vez permitimos abrir el submenu
        if ($(this).hasClass("firstOpen")) {
            e.preventDefault();
            $(this).parent().parent().addClass("current").siblings().removeClass("current");
            //accesibilidad
            $(this).parent().parent().attr("aria-checked", true).siblings().attr("aria-checked", false);
        }
        //para el resto de veces, si tiene panel-default es que esta abierto por lo que no permitimos abrir el submenu
        else if (($(this).parent().parent().hasClass("current"))) {
            e.stopPropagation();
        }
        //si no es el elemento del menu abierto, si permitimos abrir el submenu
        else {
            $(this).parent().parent().addClass("current").siblings().removeClass("current");
            //accesibilidad
            $(this).parent().parent().attr("aria-checked", true).siblings().attr("aria-checked", false);
        }
        $(".firstOpen").removeClass("firstOpen");


        //si el array de rasgos tiene una longitud 1, se puede cerrar el menu automaticamente
        var windowWidth = $(window).width();
        if (curso.unidades[curso.currIndex].rasgos.length == 1) {
            //solo si es version mobile
            abreCierraMenu();
        }
    });

    //botones submenu /*****borrar */
    /*    $(".panel-collapse").bind("click", function (e) { 
           e.stopPropagation();
           // si tiene la clase submenu_text no funciona como botón
           if (!$(this).children().first().children().first().children().first().hasClass("submenu_text")){
               direction="";
               $(this).children().first().children().first().children().first().addClass("current").siblings().removeClass("current");
               loadSubUnit($(this).siblings().children().first().data("id"),$(this).children().first().children().first().children().first().attr("id"));
               //abreCierraMenu();
           }       
       }); */

    //abrimos solo el modulo que este activado
    curso.currIndex = parseInt(seguim.puntoAbandono["unidad"]);
    $('div[id="' + curso.unidades[curso.currIndex].competence + '"]').slideDown();
    $('div[id="momento' + curso.unidades[curso.currIndex].competence + '"]').addClass("in");
}

function updatePagina() {
    var unidad = curso.unidades[curso.currIndex];
    var pagina = unidad.paginas[unidad.currIndex];
    updateNav(curso.unidades[curso.currIndex]);
    updateContent(unidad, pagina);
    var unidad_actual = curso.unidades[curso.currIndex].competence;
    var modulo_tiene_menu = curso.unidades[curso.currIndex].hasmenu;
    var windowWidth = $(window).width();
    //miramos si el mod es inicio y ademas la url de la pagina actual no es igual a la de la ultima pagina de este modulo
    if (unidad_actual == "inicio" && (curso.unidades[curso.currIndex].paginas[curso.unidades[curso.currIndex].paginas.length - 1].url != unidad.paginas[unidad.currIndex].url)) {
        $("#menu_container").css("display", "none");
        /* if (windowWidth<768){
            $(".menu_opener").css("display","none");  
        }  */
    }
    else {
        /* $("#menu_container").css("display","block");  */
        updateMenu();
    }

    if (!error_conection) {
        seguim.guardarComunicacion();
    }
}

function updateContent(unidad, pagina) {
    $("#mainContent2").empty().append($loader);
    //seguimiento scorm
    seguim.puntoAbandono["unidad"] = curso.currIndex;
    seguim.puntoAbandono["pagina"] = curso.unidades[curso.currIndex].currIndex;
    //IVAN - Marcamos a visitada la pagina en la que estamos
    seguim.vSegJSON[unidad.competence]["pags"][seguim.puntoAbandono["pagina"]]["vt"] = "1";

    //actualizar contenido de avance
    var numpagsmodulo = curso.unidades[seguim.puntoAbandono["unidad"]].paginas.length;
    var pag_act = seguim.puntoAbandono["pagina"] + 1;
    if (seguim.puntoAbandono["unidad"] == 0) {
        texto = contentSectionWelcome;
    }
    else {
        texto = contentSectionModule + seguim.puntoAbandono["unidad"] + ", " + page + pag_act + of + numpagsmodulo + "";
    }
    $("#text_header").text(texto);
    //ancla al contenido
    $("#text_header").attr("tabindex", "0");
    $("#text_header").focus();
    //window.location = "#mainContent";
    //pintamos la decoracion del modulo con el color especifico de dicho mod.
    var bod = $("body");
    bod.removeClass();
    var mod_actual = "modulo_" + curso.currIndex;
    bod.addClass(mod_actual);

    //cambio de llamada, para que no cache las paginas, y poder controlar si carga una pagina
    $.ajax({
        url: "cont/" + pagina.url,
        cache: false,
        async: false,
        dataType: "html",
        timeout: 40000,
        success: function (data) {

            $("#mainContent2").html(data);
            $(".subfoo").removeClass("mostrar");
            $(".btn_subfoo").removeClass("pulsado");
            establecerAlturaScorm($(".contenido_scorm"), $(".subfoo.mostrar"));
            window.parent.scrollTo(0,0);
        },
        error: function (xhr, status) {
            $("#error_api").css("display", "block");
            //$.colorbox({inline:true, open:true, href:"#error_api", className:"pagin_fin", overlayClose:false,escKey:false, closeButton:false, width: "60%", maxWidth: "100%"});
            //alert("Error de conexión\nSe ha perdido la conexión con la plataforma de formación. Para continuar con el contenido formativo sin perder lo que ya has realizado, por favor, sigue los pasos detallados a continuación:\n1. Cierra el curso pulsando en el aspa del navegador.\n2. Accede nuevamente al curso desde la página principal de la plataforma de formación.");
            var windowWidth = $(window).width();
            //si la resolucion es menor de 968, utilizamos 100% de pantalla para el POP UP
            if (windowWidth < 961) {
                $.colorbox({ inline: true, href: "#error_api", className: "pagin_fin", overlayClose: false, escKey: false, closeButton: false, width: "100%", maxWidth: "100%" });
            }
            else {
                $.colorbox({ inline: true, href: "#error_api", className: "pagin_fin", overlayClose: false, escKey: false, closeButton: false, width: "60%", maxWidth: "100%" });
            }
            error_conection = true;
        }
    });

    //console.log(seguim.puntoAbandono);
    //console.log(seguim.getPagMasAvanzada());
    //seguim.setValue("conf_1", "IVAN", seguim.vPuntuaciones);
    //console.log(seguim.readSeguimiento());
    //console.log(seguim.vPuntuaciones);
    //console.log((seguim.vSegJSON));
    //console.log(seguim.isCursoCompleto());
    //pasar obj to JSON
    //console.log(JSON.stringify(seguim.vSegJSON));
}

/**
* Esta funcion actualiza el navegador de la interfaz
*/
function updateNav(unidad, habilitar) {
    if (unidad.getNextDisabled(habilitar)) {
        //deshabilitar
        $(".sig").attr("disabled", "disabled").addClass("disabled");

    } else {
        //habilitar
        $(".sig").removeAttr("disabled").removeClass("disabled");
    }
    if (unidad.getPrevDisabled()) {
        //deshabilitar
        $(".ant").attr("disabled", "disabled").addClass("disabled");
    } else {
        //habilitar
        $(".ant").removeAttr("disabled").removeClass("disabled");
    }
    var pagina = curso.unidades[curso.currIndex].paginas[unidad.currIndex];
    //Si hn (ocutar next) 
    if (pagina.hn) {
        //ocultar
        $(".sig").css("opacity", "0");
    } else {
        //mostrar
        $(".sig").css("opacity", "1");
    }
    //Si hp (ocutar prev) 
    if (pagina.hp) {
        //ocultar
        $(".ant").css("opacity", "0");
    } else {
        //mostrar
        $(".ant").css("opacity", "1");
    }
}

function updateMenu() {
    //@@@ aqui mirar si hay que bloquear el menu, en todas las unidades
    for (var i = 0; i < curso.unidades.length; i++) {
        //si el modulo se ha completado se bloquea o se pinta la completitud.
        if (seguim.isModuloCompletado(i)) {
            //solo marcamos el completado si se han visitado todas las paginas
            /*  $('.menulink[data-id="' + i + '"]').parent().parent().addClass("disabled");
             //solo lo añadimos una vez
             //si ya existe no hacemos nada, si la lenth es 0 es que no existe
             if ($('.menulink[data-id="' + i + '"] img').length == 0)
             {
                $('.menulink[data-id="' + i + '"]').append("<img src='img/svg/icon_check.svg' alt='"+completedModule+"'>"); 
             }  */
            $('.menulink[data-id="' + i + '"] .logomenu').addClass("tema_completado");
            $('li[data-mod="' + i + '"] .trayecto').addClass("trayecto_disable");
            $('button[data-id="' + i + '"]').prop("disabled", false);
            $('button[data-id="' + i + '"]').attr("aria-disabled", "false");
        }

    }

    //asignamos/ marcamos el modulo acutal
    $('.menulink[data-id="' + curso.currIndex + '"]').parent().parent().addClass("current").siblings().removeClass("current");
    //accesibilidad
    $('.menulink[data-id="' + curso.currIndex + '"]').parent().parent().attr("aria-checked", true).siblings().attr("aria-checked", false);
    //cerramos el resto menos en la que estamos
    $(".panel-collapse").not('div[id="' + curso.unidades[curso.currIndex].competence + '"]').slideUp();
    //tambien abrimos el texto del submenu
    $('div[id="' + curso.unidades[curso.currIndex].competence + '"]').slideDown();
    $('div[id="momento' + curso.unidades[curso.currIndex].competence + '"]').addClass("in");
}

function loadUnit(unitIndex) {
    curso.currIndex = unitIndex;
    //para que no vuelva a la 1 pag del modulo, se comenta la siguiente linea.
    curso.unidades[curso.currIndex].currIndex = 0;
    var unidad = curso.unidades[curso.currIndex];
    updatePagina();
}

function loadSubUnit(unitIndex, subunit) {
    //console.log(curso.unidades[unitIndex].paginas);
    //buscamos el rasgo dentro de las paginas, y una vez que tenemos la primera pagina paramos el bucle
    var first_time = true;
    var paginas_unidad = curso.unidades[unitIndex].paginas;
    var current_index = -1;
    for (var i = 0; i < paginas_unidad.length; i++) {
        if ((paginas_unidad[i].rasgo == subunit) && (paginas_unidad[i].rasgo != undefined) && first_time) {
            first_time = false;
            //nos quedamos con la primera pagina que coincide con el rasgo       
            current_index = i;
        }
    };
    curso.currIndex = unitIndex;
    var unidad = curso.unidades[curso.currIndex];
    //dentro de la unidad a que pagina hace referencia
    unidad.currIndex = current_index;
    updatePagina();
}

function nextPage() {
    var unidad = curso.unidades[curso.currIndex];
    unidad.loadNextPage();
}

function prevPage() {
    var unidad = curso.unidades[curso.currIndex];
    unidad.loadPrevPage();
}

function goToHome() {
    loadUnit(0);
}

function openHelp() {
    loadPopup("help.html");
}

function openNextModule() {
    //Para la version OFFLINE - Si cmi.comments viene vacio
    if (seguim.getLongitud(seguim.modulohabilitados) == 0) {
        curso.currIndex = Math.min(curso.currIndex + 1, curso.unidades.length - 1);
    }
    else {

        //si el modulo es el primero el 0 o inicio
        if (curso.currIndex == 0) {
            curso.currIndex = seguim.modulohabilitados[0];
        }
        else {
            //sino cogemos el siguiente del vector de mods habilitados            
            var next = seguim.modulohabilitados[($.inArray(curso.currIndex.toString(), seguim.modulohabilitados) + 1) % (seguim.getLongitud(seguim.modulohabilitados))];
            curso.currIndex = next;
        }
    }
    var unidad = curso.unidades[curso.currIndex];
    unidad.currIndex = 0;
}

function openPrevModule() {
    //Para la version OFFLINE - Si cmi.comments viene vacio
    if (seguim.getLongitud(seguim.modulohabilitados) == 0) {
        curso.currIndex = Math.max(curso.currIndex - 1, 0);
    }
    else {
        //si el indice es negativo es xq no se encuentra en el vector de moduloshabilitados y hay que volver al modulo 0 o inicio  
        if (($.inArray(curso.currIndex.toString(), seguim.modulohabilitados) - 1) % (seguim.getLongitud(seguim.modulohabilitados)) < 0) {
            curso.currIndex = 0;
        }
        else {
            var next = seguim.modulohabilitados[($.inArray(curso.currIndex.toString(), seguim.modulohabilitados) - 1) % (seguim.getLongitud(seguim.modulohabilitados))];
            curso.currIndex = next;
        }
    }

    var unidad = curso.unidades[curso.currIndex];
    unidad.currIndex = unidad.paginas.length - 1;
}

function stringToBool(s) {
    if (s === "1") {
        return true;
    } else {
        return false;
    }
}

//FUNCION PARA ABRIR Y CERRAR EL MENU
function abreCierraMenu() {
    //si esta abierto, se cambia los aria a cerrado
    if ($("#menu_container").hasClass("opened")) {
        $("#navigationMenu").attr("aria-hidden", true);
        $("#navigationMenu ul").attr("aria-hidden", true);
        $("#menu_container").attr("aria-hidden", true);
    }
    else {
        $("#navigationMenu").attr("aria-hidden", false);
        $("#navigationMenu ul").attr("aria-hidden", false);
        $("#menu_container").attr("aria-hidden", false);
    }

    /*  $("#navigationMenu").toggleClass("opened");    
     $("#menu_container").toggleClass("opened"); */
    $("#menu_container").slideToggle(200);

}

///FUNCION PARA RANDOMIZAR UN CUESTIONARIO

function random_cuestionario() {
    //reiniciamos el banco de preguntas
    for (var j = 0; j < seguim.getLongitud(seguim.bancoPreguntas); j++) {
        var clave = seguim.getClave(j, seguim.bancoPreguntas);
        seguim.bancoPreguntas[clave] = 0;
    }

    var rasgo = "";
    var url = "";

    for (var j = 0; j < seguim.getLongitud(seguim.nombreRasgoRandom); j++) {
        if (seguim.nombreRasgoRandom[j]["nombre"] != "") {
            rasgo = seguim.nombreRasgoRandom[j]["nombre"];
            var rasgo_paginas = seguim.getNumPregsRasgo(rasgo);
            var parar = false;
            //recorremos el banco de preguntas y elegimos de manera aleatoria una pagina
            for (var i = 0; parar != true; i++) {
                //hacemos el random del numero de pregs aleatorias que tenga el rasgo
                var num_aleatorio = Math.floor((Math.random() * rasgo_paginas) + 1);
                //guardamos la pregunta randomizada del rasgo                              
                var rasgo_banco_preg = rasgo + "_" + num_aleatorio;
                //guardamos el rasgo de la pregunta
                var rasgo_banco = rasgo_banco_preg.substring(0, rasgo_banco_preg.indexOf("_"));
                //miramos si esta usada dicha pregunta
                var rasgo_banco_usado = seguim.bancoPreguntas[rasgo_banco_preg];
                if ((rasgo == rasgo_banco) && (rasgo_banco_usado == 0)) {
                    //marcamos a usada la pregunta
                    seguim.bancoPreguntas[rasgo_banco_preg] = 1;
                    //actualizamos el html a cargar
                    url = rasgo_banco_preg + ".html";
                    parar = true;

                }
            }
            //cambiamos la url de la pag
            seguim.vSegJSON[seguim.nombreRasgoRandom[j]["unidad"]]["pags"][seguim.nombreRasgoRandom[j]["pagina"]]["url"] = url;
            //annadimos la pagina a su UNIDAD
            //para ello buscamos la unidad y la pagina actual
            var unidad = curso.unidades[curso.currIndex];
            //y cambiamos la url
            unidad.paginas[seguim.nombreRasgoRandom[j]["pagina"]].url = url;

        }
    }
    nextPage();
};

function openPopUp() {
    // Comprobamos si el curso esta completado
    var caseid = 2; // 2 = incomplete
    if (courseCompletion == "completed") {
        caseid = 4;
        paramsAnalytics = ",width=555px,height=450px";
    }
    var scormid = getScormId();
    if (scormid) {
        var url = location.protocol + "//" + location.host + "/local/analytics/ajax.php?function=showalert&caseid=" + caseid + "&scormid=" + scormid + "&progress=" + progress + "";

        // Llamamos al web service
        $.ajax({
            url: url,
            type: "POST",
            contentType: "application/json",
            success: function (data) {
                if (data == "true") {
                    analyticswin = window.open(location.protocol + "//" + location.host + "/local/analytics/index.php?id=" + caseid + "&scormid=" + scormid + "&progress=" + progress + "", "courseWin", params + paramsAnalytics);
                    analyticswin.focus();
                }
            },
            error: function (xhr, status) {
                //alert("Error en la lamada al web service");
            }
        });
    }
}



function getScormId() {
    // Metemos los paramtetros de la URL del iframe en un array para poder acceder mejor al scoid (a)
    var src = $("iframe#scorm_object", parent.document).attr("src");
    //var src = "https://accn-lms-prepro.cclearning.accenture.com/mod/scorm/loadSCO.php?a=98&scoid=260&currentorg=ORG-E82D9CF88844F89BDC903899130E9DFF&mode=&attempt=1";
    var url_params = src.substring(src.indexOf("?") + 1);
    url_params = url_params.split("&");
    var my_params = {};
    for (var p in url_params) {
        my_params[url_params[p].substring(0, url_params[p].indexOf("="))] = url_params[p].substring(url_params[p].indexOf("=") + 1);
    }
    return my_params["a"];
}

/***************************Establece la altura del contenedor del Scorm en Moodle en funcion de la altura del contenido relacionado a los links del subfooter*****************************/
function establecerAlturaScorm(contenido_scorm, subfooter, extra) {
    if (seguim.apiCorrecta == "true") {
        if (extra == undefined) {
            extra = 0;
        }

        var subfoo_altura = 0;
        if (subfooter.length > 0) {
            subfoo_altura = subfooter.height();
        }

        var ifrm = window.parent.document.getElementById('scorm_object');
        var scorm_layout = window.parent.document.getElementById('scorm_layout');

        var altura = (contenido_scorm.height() + subfooter.height() + extra) + "px";

        ifrm.style.visibility = 'hidden';
        ifrm.style.height = altura;
        window.parent.isAvanza = true;
        ifrm.style.visibility = 'visible';

        scorm_layout.style.visibility = 'hidden';
        scorm_layout.style.height = altura;
        scorm_layout.style.visibility = 'visible';
    }
}

$(window.parent.document).find("a").on("click", function () {
    seguim.cerrarComunicacion();
});

function sesionLMS() {
    var url = location.protocol + "//" + location.host + "/blocks/acnlearning/ajax.php?action=scormsession";
    $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json",
        success: function (data) {
            if (data.errorcode == true) {
                isSessionLMS = true;
            }
            else {
                isSessionLMS = false;
                clearInterval(sesionInterval);
            }
        },
        error: function (xhr, status) {
            isSessionLMS = false;
            clearInterval(sesionInterval);
        }
    });
}

var sesionInterval = setInterval(sesionLMS, 1000);
