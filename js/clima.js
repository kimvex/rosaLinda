
/* Creamos una parte de la url de yahoo que nos servira para hacer 
geolocalización */
var base_url = "http://query.yahooapis.com/v1/public/yql?"

/* Creamos la funcion que nos ubicara en la geolocalización
usamos la latitud(lat) y la longitud(lon)*/
function obtenerGeoInformacion(lat, lon) {
	/*Por medio de esa consulta que parece una petición a DB, le decimos que es lo que queremos*/
	var query = 'SELECT * FROM geo.placefinder WHERE text="'+lat+', '+lon+'" AND gflags="R"';
	//gflags="R" le pedimos que no nos lleve directo si no que busque el mas cercano
	/*encodeURIComponent acomodamos el codigo que se enviara para que no tenga problemas, pues se enviara por medio del metodo get, eso hace que la forma en que se envie sea amigable*/
	query = encodeURIComponent(query);
	console.log(query);

	/*Ahora haciendo uso de jQuery enviamos los datos a yahoo*/
	$.ajax({
		//pasamos la url con los paramtros
		url: base_url+"q="+query,
		dataType : 'jsonp',//le decimos que seran archivos tipo jsonp
		jsonpCallback: 'procesarGeoInfo',//le damos nombre a la respuesta
		data: {
			format : 'json'//Con esto le decimos como queremos la respuesta
		}
	});
}

/*Ahora mostraremos los resultados*/
function procesarGeoInfo(datos){
	console.log(datos);
	//Le decimos la ruta donde se encuntran los datos
	var res = datos.query.results.Result;
	//Estos datos los podemos encontra por medio de la consola, pero este dato es: la ciudad.
	var barrio = res.neighborhood;
	var ciudad = res.city;
	var pais = res.country;
	/*Yahoo a cada lugar le da un id unico y ese id lo obtenemos en*/
	var woeid = res.woeid;

	/*Ahora haciendo uso de jQuery mostramos los resultados*/
	$('#geo').prepend('<p><strong>'+barrio+'</strong><br>'+ciudad+', '+pais+'</p>');

	/*Pero si queremos ver el clima la forma seria la siguiente, primero al terminar el reconocimiento del lugar ejecutanos la función que hará todo eso y le pasamos por parametro el id unico del lugar */
	obtenerClima(woeid);
}

function obtenerClima(woeid) {
	/*La consulta del clima es diferente al del lugar*/
	var query = 'SELECT * FROM weather.forecast WHERE woeid="'+woeid+'" and u ="c"';
	//u="c" es paa decirle que nos de la temperatura en y todo lo demas en español usando grados centigrados.
	query = encodeURIComponent(query);
	console.log(query);

	$.ajax({
		url: base_url+"q="+query,
		dataType : 'jsonp',
		jsonpCallback: 'procesarClima',
		data: {
			format : 'json'
		}
	});
}

function procesarClima(datos){
	console.log(datos);
	var clima = datos.query.results.channel;
	var temp = clima.item.condition.temp;
	var unit = clima.units.temperature;
	var code = clima.item.condition.code;
	var img = new Image();
	img.src = "http://l.yimg.com/a/i/us/we/52/"+code+".gif";
	console.log(clima);
	$('#clima')
		.append(img)
		.append(temp+' '+unit+'*');

		//Si queremos que el mismo yahoo nos de la información pss es solo de colocar el clima en el append
		/*.append(clima.item.description);*/
}