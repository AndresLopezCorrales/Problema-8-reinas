//Declaración de variables globales
var contador = 0;

var colorLineaAtaque = null; //Variable para cambiar color de la linea de ataque de reinas

var puestos = "";

var contadorTexto = "";

//onclick function para cada celda de la tabla
function mostrarReina(celda) {

    //Obtener row
    let rowIndex = celda.parentNode.rowIndex;

    // Obtener columna
    let columnIndex = Array.from(celda.parentNode.children).indexOf(celda);

    let backgroundImage = window.getComputedStyle(celda).backgroundImage;

    puestos = document.getElementById("puestos");

    contadorTexto = document.getElementById("contador");

    //Si la celda no tiene imagen se le quitará la class de la celda
    if (backgroundImage !== "none") {
        celda.classList.remove("celda-definitiva");
    }

    //SI tiene la class "celda-definitva" no se podrá clickear esa celda
    if (celda.classList.contains("celda-definitiva")) return;

    if (window.getComputedStyle(celda).backgroundImage == "none") {
        if (contador < 8) {
            celda.style = `
                background-image: url(${cambiarPersonaje()});
                background-size: auto;
                background-repeat: no-repeat;
                background-position: center;`;
            pintarBloquear(rowIndex, columnIndex, true); // Pintar y marcar celdas definitivas
            contador++;
            puestos.textContent = contador;
            if (contador == 8) {
                contadorTexto.textContent = ""
                puestos.textContent = "GANASTE";
            }

        }
    } else {
        celda.style = `background-image: none;`;
        pintarBloquear(rowIndex, columnIndex, false); // Quitar marca definitiva
        document.getElementById("soluciones").value = "--";
        verificarCeldas(); //Verificar si hay imagenes en la celda y pintar sus diagonales
        contador--;
        puestos.textContent = contador;
        contadorTexto.textContent = "Contador: "
    }

}

//FUcnión paa verificar si hay imagenes en las celdas y pintar sus lineas de ataque
function verificarCeldas() {
    var tablero = document.getElementById("tablero");

    // Limpiar el tablero antes de repintar
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            tablero.rows[i].cells[j].style.backgroundColor = "";
            tablero.rows[i].cells[j].classList.remove("celda-definitiva");
        }
    }

    // Buscar todas las reinas en el tablero
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let celda = tablero.rows[i].cells[j];
            let backgroundImage = window.getComputedStyle(celda).backgroundImage;

            // Si la celda tiene una reina, volver a pintar sus líneas de ataque
            if (backgroundImage !== "none") {
                pintarBloquear(i, j, true);
            }
        }
    }
}

//Pintar y bloquear diagonales, horizonatales y verticales de las imagenes en el tablero
function pintarBloquear(r, c, marcarDefinitivo) {
    var color = colorLineaAtaque || "red";

    var celda = document.getElementById("tablero");
    var r1 = r, c1 = c, r2 = r, c2 = c;
    var r3 = r, c3 = c, r4 = r, c4 = c;

    for (let i = 0; i < 8; i++) {
        // Pintar horizontales y verticales
        pintarCelda(celda.rows[r].cells[i], color, marcarDefinitivo);
        pintarCelda(celda.rows[i].cells[c], color, marcarDefinitivo);

        // Pintar diagonales
        if (r1 < 8 && c1 < 8) pintarCelda(celda.rows[r1++].cells[c1++], color, marcarDefinitivo);
        if (r2 > -1 && c2 < 8) pintarCelda(celda.rows[r2--].cells[c2++], color, marcarDefinitivo);
        if (r3 > -1 && c3 > -1) pintarCelda(celda.rows[r3--].cells[c3--], color, marcarDefinitivo);
        if (r4 < 8 && c4 > -1) pintarCelda(celda.rows[r4++].cells[c4--], color, marcarDefinitivo);
    }
}

//Definir la "class" de cada celda 
function pintarCelda(celda, color, marcarDefinitivo) {
    if (marcarDefinitivo) {
        celda.style.backgroundColor = color;
        celda.classList.add("celda-definitiva");
    } else {
        celda.style.backgroundColor = "";
        celda.classList.remove("celda-definitiva");
    }
}

//onmouseover function para que se vea donde se pondrá la reina
function cambiarColor(r, c) {

    var color = colorLineaAtaque || "red";

    var celda = document.getElementById("tablero");
    var r1 = r, c1 = c, r2 = r, c2 = c;
    var r3 = r, c3 = c, r4 = r, c4 = c;

    for (let i = 0; i < 8; i++) {
        celda.rows[r].cells[i].style.backgroundColor = color;
        celda.rows[i].cells[c].style.backgroundColor = color;

        if (r1 < 8 && c1 < 8) {
            celda.rows[r1++].cells[c1++].style.backgroundColor = color;
        }

        if (r2 > -1 && c2 < 8) {
            celda.rows[r2--].cells[c2++].style.backgroundColor = color;
        }

        if (r3 > -1 && c3 > -1) {
            celda.rows[r3--].cells[c3--].style.backgroundColor = color;
        }

        if (r4 < 8 && c4 > -1) {
            celda.rows[r4++].cells[c4--].style.backgroundColor = color;
        }
    }


}

//Cambiar el color de la línea de ataque, incluso si ya hay celdas pintadas en el tablero
function cambiarColorAtaque() {
    var colorAtaque = document.getElementById("color-ataque");

    colorAtaque.addEventListener("input", () => {
        colorLineaAtaque = colorAtaque.value;

        var tablero = document.getElementById("tablero");

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let celda = tablero.rows[i].cells[j];

                if (!celda.classList.contains("celda-definitiva")) {
                    celda.style.backgroundColor = "";
                }
            }
        }

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let celda = tablero.rows[i].cells[j];

                if (window.getComputedStyle(celda).backgroundImage !== "none") {
                    pintarBloquear(i, j, true);
                }
            }
        }
    });
}

//Limpiar en caso de que no este una celda como "celda-definitiva"
function limpiar() {
    var celdas = document.getElementsByTagName("td");

    for (let i = 0; i < celdas.length; i++) {
        if (!celdas[i].classList.contains("celda-definitiva")) {
            celdas[i].style.backgroundColor = "";
        }
    }
}

//Función para la solución -- (otro limpiar)
function limpiarSolucionCero() {
    var celdas = document.getElementsByTagName("td");

    for (let i = 0; i < celdas.length; i++) {
        celdas[i].style.backgroundColor = "";
        celdas[i].classList.remove("celda-definitiva");

    }
}

//Limpiar imagen dentro del tablero
function limpiarImagen() {
    var celdas = document.getElementsByTagName("td");

    for (let i = 0; i < celdas.length; i++) {
        celdas[i].style.backgroundImage = "none";

    }
}

//Restart button
function limpiarTodo() {
    contador = 0;
    document.getElementById("soluciones").value = "--";
    puestos = document.getElementById("puestos");
    contadorTexto = document.getElementById("contador");


    limpiarSolucionCero();
    limpiar();
    limpiarImagen();


    puestos.textContent = contador;

    if (contador < 8) {
        contadorTexto.textContent = "Contador: "
    }

}

//Selección de soluciones del problema de las ocho reinas
function soluciones() {
    contador = 8;
    var celdas = document.getElementById("tablero");
    var soluciones = document.getElementById("soluciones");
    puestos = document.getElementById("puestos");
    contadorTexto = document.getElementById("contador");

    var solucionSeleccionada = soluciones.value;

    switch (solucionSeleccionada) {
        case "--":
            contadorTexto.textContent = "Contador: "
            puestos.textContent = 0;
            limpiarImagen();
            limpiarSolucionCero();
            contador = 0;
            break;

        case "solucion1":
            limpiarImagen();
            contadorTexto.textContent = "Contador: "
            puestos.textContent = contador;
            var estilo = `
            background-image:url(${cambiarPersonaje()});
            background-image: auto;
            background-repeat:no-repeat;
            background-position: center;`;

            celdas.rows[0].cells[3].style = estilo;
            celdas.rows[1].cells[6].style = estilo;
            celdas.rows[2].cells[2].style = estilo;
            celdas.rows[3].cells[7].style = estilo;
            celdas.rows[4].cells[1].style = estilo;
            celdas.rows[5].cells[4].style = estilo;
            celdas.rows[6].cells[0].style = estilo;
            celdas.rows[7].cells[5].style = estilo;
            verificarCeldas();

            break;

        case "solucion2":
            limpiarImagen();
            contadorTexto.textContent = "Contador: "
            puestos.textContent = contador;
            var estilo = `
            background-image:url(${cambiarPersonaje()});
            background-image: auto;
            background-repeat:no-repeat;
            background-position: center;`;

            celdas.rows[0].cells[5].style = estilo;
            celdas.rows[1].cells[3].style = estilo;
            celdas.rows[2].cells[6].style = estilo;
            celdas.rows[3].cells[0].style = estilo;
            celdas.rows[4].cells[7].style = estilo;
            celdas.rows[5].cells[1].style = estilo;
            celdas.rows[6].cells[4].style = estilo;
            celdas.rows[7].cells[2].style = estilo;
            verificarCeldas();
            break;

        case "solucion3":
            limpiarImagen();
            contadorTexto.textContent = "Contador: "
            puestos.textContent = contador;
            var estilo = `
            background-image:url(${cambiarPersonaje()});
            background-image: auto;
            background-repeat:no-repeat;
            background-position: center;`;

            celdas.rows[0].cells[3].style = estilo;
            celdas.rows[1].cells[1].style = estilo;
            celdas.rows[2].cells[6].style = estilo;
            celdas.rows[3].cells[2].style = estilo;
            celdas.rows[4].cells[5].style = estilo;
            celdas.rows[5].cells[7].style = estilo;
            celdas.rows[6].cells[4].style = estilo;
            celdas.rows[7].cells[0].style = estilo;
            verificarCeldas();
            break;


        default:
            contadorTexto.textContent = "Contador: "
            puestos.textContent = 0;
            limpiarSolucionCero();
            limpiarImagen();
            break;
    }

}

function resaltadoImg(imagen, img1, img2) {

    img1.style.backgroundColor = "";
    img2.style.backgroundColor = "";
    imagen.style.backgroundColor = "#f0cccc";
}

//Selección de imagenes para cambiarlas dinamicamente
function cambiarPersonaje() {

    var imagenes = document.getElementById("imagenes");

    var imagenSeleccionada = imagenes.value;

    var imagentxt = "";

    var fotoReina = document.getElementById("foto-reina");
    var fotoFoxy = document.getElementById("foto-foxy");
    var fotoJiggly = document.getElementById("foto-jiggly");

    switch (imagenSeleccionada) {
        case "reina":
            imagentxt = "./img/reina.png"
            resaltadoImg(fotoReina, fotoFoxy, fotoJiggly);
            break;

        case "foxy":
            imagentxt = "./img/foxy.png"
            resaltadoImg(fotoFoxy, fotoReina, fotoJiggly);
            break;

        case "jiggly":
            imagentxt = "./img/jiggly.png"
            resaltadoImg(fotoJiggly, fotoFoxy, fotoReina);
            break;

        default:
            imagentxt = "./img/reina.png"
            resaltadoImg(fotoReina, fotoFoxy, fotoJiggly);
            break;
    }

    //Cambiar la imagen aunque ya haya imagenes puestas
    const celdas = document.querySelectorAll(".celda");

    celdas.forEach(celda => {
        if (window.getComputedStyle(celda).backgroundImage !== "none") {
            celda.style.backgroundImage = `url(${imagentxt})`;
        }

    });

    return imagentxt;

}

//Cambiar color del tablero en base a la selección de color
function colorImpar() {
    var colorImpar = document.getElementById("color-impar");

    colorImpar.addEventListener("input", () => {

        var color = colorImpar.value;

        impar(color);
    });

}

function colorPar() {
    var colorPar = document.getElementById("color-par");

    colorPar.addEventListener("input", () => {

        var color = colorPar.value;

        par(color);
    });

}

//Cambiar color en el css de las celdas del tablero impar
function impar(color) {
    document.documentElement.style.setProperty('--impar', color);
}

//Cambiar color en el css de las celdas del tablero par
function par(color) {
    document.documentElement.style.setProperty('--par', color);
}