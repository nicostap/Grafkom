const MoveType = Object.freeze({
    Rotate: 'Rotate',
    Translate: 'Translate',
});

class Animate {
    // Parameters
    object;
    start;
    end;
    type;
    x;
    y;
    z;

    constructor(object, start, end, type, x, y, z) {
        this.object = object;
        this.start = start;
        this.end = end;
        this.type = type;
        this.x = x;
        this.y = y;
        this.z = z;

        if (type == 'Rotate') {
            this.x *= Math.PI / 180.0;
            this.y *= Math.PI / 180.0;
            this.z *= Math.PI / 180.0;
        }
    }

    run(time, dt) {
        if(time > this.start && time < this.end) {
            // Count the frames
            var fc = Math.floor(this.end / dt) - Math.ceil(this.start / dt);
            if(this.type == 'Rotate') {
                this.object.rotate(this.x / fc, this.y / fc, this.z / fc);
            } else if(this.type == 'Translate') {
                this.object.translate(this.x / fc, this.y / fc, this.z / fc);
            }
        }
    }
}