const MoveType = Object.freeze({
    Rotate: 'Rotate',
    Translate: 'Translate',
    Scale: 'Scale'
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
    curr_x = 1.0;
    curr_y = 1.0;
    curr_z = 1.0;

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
            var div = dt / (this.end - this.start);
            if(this.type == 'Rotate') {
                this.object.rotate(this.x * div, this.y * div, this.z * div);
            } else if(this.type == 'Translate') {
                this.object.translate(this.x * div, this.y * div, this.z * div);
            } else if(this.type == 'Scale') {
                this.object.scale(1 / this.curr_x, 1 / this.curr_y, 1 / this.curr_z);
                this.curr_x += (this.x - 1.0) * div;
                this.curr_y += (this.y - 1.0) * div;
                this.curr_z += (this.z - 1.0) * div;
                //console.log(this.curr_x, this.curr_y, this.curr_z);
                this.object.scale(this.curr_x, this.curr_y, this.curr_z);
            }
        }
    }
}

class AnimationList {
    // Parameter
    animations;
    start = 99999999999;
    end = 0;
    isLoop;

    constructor(animations, isLoop) {
        this.animations = animations;
        this.isLoop = isLoop;
        for(let i = 0; i < this.animations.length; i++) {
            this.start = Math.min(this.start, this.animations[i].start);
            this.end = Math.max(this.end, this.animations[i].end);
        }
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
                this.animations[i].curr_x = 1.0;
                this.animations[i].curr_y = 1.0;
                this.animations[i].curr_z = 1.0;
            }
        }
    }

    multiplySpeed(x) {
        this.end = 0;
        for(let i = 0; i < this.animations.length; i++) {
            let offset = this.start * (1 - x);
            this.animations[i].start *= x;
            this.animations[i].end *= x;
            this.animations[i].start += offset;
            this.animations[i].end += offset;
            this.end = Math.max(this.end, this.animations[i].end);
        }
    }
}