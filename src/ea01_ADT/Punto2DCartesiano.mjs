import assert from 'node:assert/strict';
import Punto2D from './Punto2D.mjs';

export default class Punto2DCartesiano extends Punto2D {

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }

    toString() {
        return "(" + this.x + "," + this.y + ")";
    }

    get getX() { return this.x }

    get getY() { return this.y }

    set setX(newx) { this.x = newx }

    set setY(newy) { this.y = newy }

}


// Algunas pruebas unitarias
let punto1 = new Punto2DCartesiano(1,2);
let punto2 = new Punto2DCartesiano(4,2);
assert( punto1.getX === 1 );
assert( punto1.getY === 2 );
assert( Math.abs(punto2.distancia(punto1)-3)<1E-8 );


