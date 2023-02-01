class Fecha {

    constructor(año, mes, dia) {
        this.año = año;
        this.mes = mes;
        this.dia = dia;
    }

    diaDelAño() {
        // TODO calcular el dia del año para la fecha
    }

    esBiciesto() {
        // TODO returnar True si el año es biciesto
    }


    toString() {
        return ""+this.año+"-"+this.mes+"-"+this.dia;
    }

}


// Algunas pruebas
let f = new Fecha(2023,2,1);
console.log(`${f}`);

