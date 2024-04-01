class Fecha {

    // Variables de instancia privadas para garantizar encapsulación
    #año
    #mes
    #dia

    constructor(año, mes, dia) {
        this.#año = año;
        this.#mes = mes;
        this.#dia = dia;
    }

    diaDelAño() {
        // TODO calcular el dia del año para la fecha
    }

    esBiciesto() {
        // TODO returnar True si el año es biciesto
    }


    toString() {
        return ""+this.#año+"-"+this.#mes+"-"+this.#dia;
    }

    // Método estático (función de biblioteca). Patrón Factory
    static FechaHoy() {
        const d = new Date();
        return new Fecha(d.getFullYear(), d.getMonth()+1, d.getDate());
    }

}


// Algunas pruebas
let f = new Fecha(2023,2,1);
console.log(`${f}`);

let hoy = Fecha.FechaHoy();
console.log(`${hoy}`);



// Ejercicios:
// ==========
// 1. Completar la implementacion del ADT
// 2. Implementar la operación (API) diaDelAño
// 3. Implementar la igualdad entre ADTs Fecha
// 4. Implementar mas ejemplos de uso del ADT
// 5. Hacer una aplicación "cliente" que calcule cuantos dias faltan para el cumpleaños
// 6. Implementar un método estático "Factory" que cree instancias a partir de datos ingresados por consola
// 7. Implementar la interface Comparable y hacerle pruebas
