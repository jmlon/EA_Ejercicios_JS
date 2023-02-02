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

    // Método estático (función de biblioteca). Patrsón Factory
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