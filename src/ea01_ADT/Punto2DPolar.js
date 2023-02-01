class Punto2DPolar extends Punto2D {

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