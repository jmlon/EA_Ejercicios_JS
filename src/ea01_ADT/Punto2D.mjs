export default class Punto2D {

    distancia(p2) {
        // return Math.sqrt(
        //     (this.getX - p2.getX) * (this.getX - p2.getX) + (this.getY - p2.getY) * (this.getY - p2.getY)
        // );

        // Mas elegante el uso de la funcion hypot(enusa)
        return Math.hypot(this.getX - p2.getX, this.getY - p2.getY);
    };

    equals(p2) {
        return this.distancia(p2) < 1E-6;
    }

}


// Ejercicios:
// ==========
// 1. Dar dos implementaciones de este ADT: Una version en coordenadas cartesianas y otra en polares
// 1b. Hacer que el método distancia opere con cualquier representacion del Punto2D
// 2. Implementar el método toString para las subclases
// 2b. Implementar la igualdad de ADTs Punto2D
// 3. Implementar pruebas unitarias de los métodos distancia, equals, toString.
