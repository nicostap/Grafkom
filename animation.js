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

class AnimationList {
    // Parameter
    animations;
    start;
    end;
    isLoop;

    constructor(animations, start, end, isLoop) {
        this.animations = animations;
        this.start = start;
        this.end = end;
        this.isLoop = isLoop;
    }

    run(time, dt) {
        if(time > this.start && time < this.end) {
            for(let animation of this.animations) {
                animation.run(time, dt);
            }
        }
        if(time > this.end && this.isLoop) {
            let duration = this.end - this.start + 2 * dt;
            this.start += duration;
            this.end += duration;
            for(let i = 0; i < this.animations.length; i++) {
                this.animations[i].start += duration;
                this.animations[i].end += duration;
            }
        }
    }
}