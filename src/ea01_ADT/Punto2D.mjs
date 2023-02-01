export default class Punto2D {

    distancia(p2) {
        return Math.sqrt(
            (this.getX - p2.getX) * (this.getX - p2.getX) + (this.getY - p2.getY) * (this.getY - p2.getY)
        )
    };

    equals(p2) {
        return this.distancia(p2) < 1E-6;
    }

}
