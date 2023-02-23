<?php

/*
* Autor: Ángel Torada González
* Fecha: 07/02/2023
* Descripción: Modelo de la aplicación que se encarga de realizar las consultas a la base de datos
*/


//Conexion a la base de datos
$db = new PDO('mysql:host=localhost;dbname=empresa', 'root', '');

//Se establece el número de registros por página
$cantidadPorPagina = 4;

//Se obtiene el número de empleados (De la tabla empleado no empleados como dice en el ejercicio pues el SQL no es correcto)
$query = "SELECT count(*) FROM empleado";
$s = $db->query($query);
$cantidadEmpleados = $s->fetchColumn();

//Se obtiene el número de páginas
$totalPaginas = ceil($cantidadEmpleados / $cantidadPorPagina);

//Se comprueba que se ha recibido la página
if (!isset($_GET['page'])) {
    //Error
    $data[] = array(
        'error' => 'No se ha recibido la página'
    );
    $pagina = 1;
} else {
    $pagina = $_GET['page'];
}


//Se realiza la consulta en base a la página y el número de registros por página
$empiezaPor = ($pagina - 1) * $cantidadPorPagina;
$consulta  = "SELECT * FROM empleado ORDER BY idempleado DESC LIMIT ?,?";

$r = $db->prepare($consulta);
$r->bindParam(1, $empiezaPor, PDO::PARAM_INT);
$r->bindParam(2, $cantidadPorPagina, PDO::PARAM_INT);
$r->execute();

//Además al array se le añade el número de páginas y la página actual
//La página actual se añade para que el cliente sepa en qué página está aunque tenga su propio contador
$json[] = array(
    'total_pages' => $totalPaginas,
    'page' => $pagina
);

//Devuelve un array en JSON con los datos
while ($row = $r->fetch(PDO::FETCH_ASSOC)) {
    $json[] = $row;
}

echo json_encode($json);
