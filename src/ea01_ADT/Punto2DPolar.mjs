import assert from 'node:assert/strict';
import Punto2D from './Punto2D.mjs';
import Punto2DCartesiano from './Punto2DCartesiano.mjs';

export default class Punto2DPolar extends Punto2D {

    // Instace varibles
    #r
    #theta

    constructor(r, t) {
        super();
        this.#r = r;
        this.#theta = Punto2DPolar.toRadians(t);
    }


    toString() { return `Magnitud: ${this.#r}, Angulo: ${Punto2DPolar.toDegrees(this.#theta)}` };

    get getX() { return this.#r * Math.cos(this.#theta) };

    get getY() { return this.#r * Math.sin(this.#theta) };


    // Métodos estaticos: Funciones de biblioteca

    static toRadians(t) { return t * Math.PI / 180; };

    static toDegrees(t) { return t * 180 / Math.PI; };


}

// Algunas pruebas unitarias
let punto1 = new Punto2DPolar(1,45);
let punto2 = new Punto2DPolar(1,135);
assert( Math.abs(punto1.getX-Math.sqrt(2)/2)<1E-8 );
assert( Math.abs(punto1.getY-Math.sqrt(2)/2)<1E-8 );
assert( Math.abs(punto1.distancia(punto2)-Math.sqrt(2)) < 1E-8 );

let punto3 = new Punto2DCartesiano(Math.sqrt(2)/2, Math.sqrt(2)/2);
// console.log(punto1.distancia(punto3));
assert(punto1.distancia(punto3)<1E-8);
