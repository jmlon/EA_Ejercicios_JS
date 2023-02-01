import assert from 'node:assert/strict';

export class Stack {

    constructor() {
        this.items = [];    // Se usa una lista de JS
    }

    push(item) {
        this.items.push(item);
    }

    pop() {
        return this.items.pop();
    }

    isEmpty() {
        return this.items.length===0;
    }

    size() {
        return this.items.length;
    }

}


// Algunas pruebas unitarias
let pila = new Stack();
assert(pila.isEmpty());
assert(pila.size()===0);
pila.push(1);
pila.push("Hola");
assert(pila.size()===2);
assert(pila.pop()==="Hola");
assert(pila.pop()===1);

