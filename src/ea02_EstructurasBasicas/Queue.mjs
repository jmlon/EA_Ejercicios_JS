import assert from 'node:assert/strict';

export class Queue {

    constructor() {
        this.items = [];    // Se usa una lista de JS
    }

    enqueue(item) {
        this.items.push(item);
    }

    dequeue() {
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length===0;
    }

    size() {
        return this.items.length;
    }

}


// Algunas pruebas unitarias
let cola = new Queue();
assert(cola.isEmpty());
assert(cola.size()===0);
cola.enqueue(1);
cola.enqueue("Hola");
assert(cola.size()===2);
assert(cola.dequeue()===1);
assert(cola.dequeue()==="Hola");

