import assert from 'node:assert/strict';
import Punto2D from './Punto2D.mjs';
import Punto2DCartesiano from './Punto2DCartesiano.mjs';

export default class Punto2DPolar extends Punto2D {

    constructor(r, t) {
        super();
        this.r = r;
        this.theta = this.toRadians(t);
    }

    toRadians(t) { return t * Math.PI / 180; };

    toDegrees(t) { return t * 180 / Math.PI; };

    toString() { return `Magnitud: ${this.r}, Angulo: ${this.toDegrees(this.theta)}` };

    get getX() { return this.r * Math.cos(this.theta) };

    get getY() { return this.r * Math.sin(this.theta) };

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
