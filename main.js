/*Boton hacia arriba de index.html*/ 
const miBoton = document.getElementById('miBoton');

if (miBoton) {
    miBoton.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', function() {
        if (window.scrollY > 600) {
            miBoton.classList.add('visible');
        } else {
            miBoton.classList.remove('visible');
        }
    });
}

/*Botones de Practicas.html*/
const goUp = document.getElementById('go-up');
const alertButton = document.getElementById('alertButton');
const backgroundButton = document.getElementById('backgroundButton');

if (backgroundButton) {
    backgroundButton.addEventListener('click', function() {
        document.body.style.backgroundColor = "#E9C3DE"; // o el color que quieras
    });
}

if (goUp) {
    goUp.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

if (alertButton) {
    alertButton.addEventListener('click', function() {
        alert('Hola, soy un botón');
    });
}