var tiempo;

function iniciarTiempo(tiemp)
{
	tiempo = new Date().getTime();
}

function timeStringToMs(a,b){// time(HH:MM:SS.mss) // optimized
 return a=a.split('.'), // optimized
  b=a[1]*1||0, // optimized
  a=a[0].split(':'),
  b+(a[2]?a[0]*3600+a[1]*60+a[2]*1:a[1]?a[0]*60+a[1]*1:a[0]*1)*1e3 // optimized
}
function convertirSegTotales(ts)
{
	var hora;
	var minutos;
	
	var seg = (ts % 60);
	ts -= seg;
	var tmp = (ts % 3600);
	ts -= tmp;
	
	seg = Math.round(seg*100)/100;
	
	var strSeg = new String(seg);
	var strSegCompl = strSeg;
	var strSegFrac = "";
	
	if (strSeg.indexOf(".") != -1){
		strSegCompl =  strSeg.substring(0, strSeg.indexOf("."));
		strSegFrac = strSeg.substring(strSeg.indexOf(".")+1, strSeg.length);
	}
	
	if (strSegCompl.length < 2){
		strSegCompl = "0" + strSegCompl;
	}
	
	strSeg = strSegCompl;
	
	if (strSegFrac.length){
	   strSeg = strSeg + "." + strSegFrac;
	}
	
	if ((ts % 3600) != 0 ){
	   var hora = 0;
	}else{
		var hora = (ts / 3600);
	}
	if ( (tmp % 60) != 0 ){
		var minutos = 0;
	}else{
		var minutos = (tmp / 60);
	}
	
	if ((new String(hora)).length < 2){
		hora = "0"+hora;
	}
	if ((new String(minutos)).length < 2){
		minutos = "0"+minutos;
	}
	
	var rtnVal = hora+":"+minutos+":"+strSeg;

	return rtnVal;
}
	
function getTiempoFormateado()
{
	var tiempoFormateado;
	
	if ( tiempo != 0 ){
		var nuevoTiempo = new Date().getTime();
		var diferenciaSegundos = ( (nuevoTiempo - tiempo) / 1000 );
		tiempoFormateado = convertirSegTotales( diferenciaSegundos );
	}else{
		tiempoFormateado = "00:00:00.0";
	}
	return tiempoFormateado;
}