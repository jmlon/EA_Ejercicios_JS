// Implementando una calculadora polaca inversa utilizando una Pila

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function leerEntradas() {
    rl.question("Ingrese valor/operador: ", (input) => {
        console.log('Valor ingresado', input);
        if (input=='=')
            rl.close();
        else
            leerEntradas();
    });
}
    

leerEntradas();


// TODO
// 1. Instanciar la Pila
// 2. Agregar los valores a la pila
// 3. Realizar las operaciones aritmeticas segun el operando
// 4. Agregar manejo de errores (Punto Extra)




