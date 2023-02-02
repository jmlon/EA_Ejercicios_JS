import assert from 'node:assert/strict';

export class FechaComparable {

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

    /*
    Los llamandos a > < están invocando el toString,
    lo que hace que las comparaciones fallen para ciertas formas del string
    */
    toString() {
        console.log("zz");
        return ""+this.#año+"-"+this.#mes+"-"+this.#dia;
    }

    /*
    Se define valueOf para devolver un entero que "crece monotonicamente" en función de la fecha.
    De esta forma, los operaciones relaciones >,<,>=,<= que hacen la invocación automatica de valueOf
    operaran correctamente.
    */
    valoeOf() {
        console.log("xx");
        return this.#dia + this.#mes*31 + this.#año*366;
    }

    // Método estático (función de biblioteca). Patrsón Factory
    static FechaHoy() {
        const d = new Date();
        return new FechaComparable(d.getFullYear(), d.getMonth()+1, d.getDate());
    }

}


// Algunas pruebas
let f1 = new FechaComparable(2023,2,10);
let f2 = new FechaComparable(2023,2,15);
let f3 = new FechaComparable(2023,1,20);
let f4 = new FechaComparable(2020,12,31);
let f5 = new FechaComparable(2023,10,31);

// assert(f1<f2, `${f1} debe ser menor que ${f2}`);
// assert(f2>f3);
// assert(f3<f1);
// assert(f3>f4);
// assert(f4<f3);

// TODO : Estos casos fallan porque se estan comparando como Strings. Como corregirlo?
assert(f5>f2, `${f5} debe ser mayor a ${f2}`);
assert(f2<f5, `${f2} debe ser menor a ${f5}`);
