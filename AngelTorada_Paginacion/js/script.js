
/*
    * Autor: Ángel Torada González
    * Fecha: 07/02/2023
    * Descripción: Script para generar una tabla con los datos de la tabla empleados de la base de datos y su paginación
*/


//Variable pagina guarda la página actual
var pagina = 1;
//Variable paginas guarda el número de páginas
var paginas = 0;

/*
    * Función que crea la tabla con los datos recibidos
    * @param {array} datos
*/
function crearTablaEmpleados(datos) {
    //Lo hace con XMLHttpRequest
    var tabla = "<table>";
    tabla += "<tr>  <th>Nombre</th>     <th>Departamento</th>      <th>Sueldo</th> </tr>";
    for (var i = 1; i < datos.length; i++) {
        tabla += "<tr><td>" + datos[i].nombres + "</td><td>" + datos[i].departamento + "</td><td>" + datos[i].sueldo + "</td></tr>";
    }
    tabla += "</table>";
    document.getElementById("tabla").innerHTML = tabla;


    //Un ejemplo de como hacerlo con dom
    /* 
        var tabla = document.createElement("table");
        tabla.setAttribute("border", "1");
        var tr = document.createElement("tr");
        var th1 = document.createElement("th");
        var th2 = document.createElement("th");
        var th3 = document.createElement("th");
        var text1 = document.createTextNode("Nombre");
        var text2 = document.createTextNode("Departamento");
        var text3 = document.createTextNode("Sueldo");
        th1.appendChild(text1);
        th2.appendChild(text2);
        th3.appendChild(text3);
        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);
        tabla.appendChild(tr);
        for (var i = 1; i < datos.length; i++) {
            var tr = document.createElement("tr");
            var td1 = document.createElement("td");
            var td2 = document.createElement("td");
            var td3 = document.createElement("td");
            var text1 = document.createTextNode(datos[i].nombres);
            var text2 = document.createTextNode(datos[i].departamento);
            var text3 = document.createTextNode(datos[i].sueldo);
            td1.appendChild(text1);
            td2.appendChild(text2);
            td3.appendChild(text3);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tabla.appendChild(tr);
        }
    
        document.getElementById("tabla").replaceChild(tabla, document.getElementById("tabla").firstChild);
      */


}


/*
    * Función que obtiene los datos de la tabla empleados
    * @param {int} pagina
    * @return {array} datos
*/
function obtenerEmpleados() {
    //Se hace con XMLHttpRequest
    var xhr = new XMLHttpRequest();
    //Se establece la petición
    xhr.open("GET", "modelo.php?" + "page=" + pagina, true);
    //Al recibir la respuesta
    xhr.onload = function () {
        if (this.status == 200) {

            //Try catch para evitar errores al parsear el json
            try {
                //Recibe el json y lo formate en tabla y la añade al div con id tabla
                var datos = JSON.parse(this.responseText);

                //Se crea la tabla con los datos recibidos
                crearTablaEmpleados(datos);

                //Se guarda en una variable el número de páginas
                paginas = datos[0].total_pages;

                //Se guarda el número de páginas en el span con id paginas
                document.getElementById("paginas").innerText = paginas;
                //Se guarda el número de página actual en el span con id pagina
                document.getElementById("pagina").innerText = pagina;

            } catch (error) {
                document.body.innerHTML = "Error al parsear los datos JSON";
            }
        } else {
            //Si no, muestra un mensaje de error
            document.body.innerHTML = "Error al cargar la tabla";
        }

    }

    //Se envía la petición
    xhr.send();
}

//Al cargar la página
window.onload = function () {

    //Al cargar la página, se carga la tabla con la página 1
    obtenerEmpleados();

    //Para el botón primero se carga la página 1 y se vuelve a cargar la tabla
    document.getElementById("primero").addEventListener("click", function () {
        //Si la página actual es diferente de 1, se carga la página 1
        if (pagina != 1) {
            pagina = 1;
            obtenerEmpleados();
        }
    });

    //Para el botón siguiente se suma 1 a la página actual y se vuelve a cargar la tabla
    document.getElementById("siguiente").addEventListener("click", function () {
        //Si la página es menor que el número de páginas, se suma 1 a la página actual
        if (pagina < paginas) {
            pagina++;
            obtenerEmpleados();
        }
    });

    //Para el botón anterior se resta 1 a la página actual y se vuelve a cargar la tabla
    document.getElementById("anterior").addEventListener("click", function () {
        //Si la página es mayor que 1, se resta 1 a la página actual
        if (pagina > 1) {
            pagina--;
            obtenerEmpleados();
        }
    });

    //Para el botón último se carga la última página y se vuelve a cargar la tabla
    document.getElementById("ultimo").addEventListener("click", function () {
        //Si la página actual es diferente de la última página, se carga la última página
        if (pagina != paginas) {
            pagina = paginas;
            obtenerEmpleados();
        }
    });
}
