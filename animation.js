class TranslationAnimation {
    object;
    start;
    end;
    x; y; z;
    constructor(object, start, end, x, y, z) {
        this.object = object;
        this.start = start;
        this.end = end;
        this.x = x;
        this.y = y;
        this.z = z;
    }

    run(time, dt) {
        if (time > this.start && time < this.end) {
            var div = dt / (this.end - this.start);
            this.object.translate(this.x * div, this.y * div, this.z * div);
        }
    }
}

class RotationAnimation {
    object;
    start;
    end;
    ax; ay; az;

    constructor(object, start, end, ax, ay, az) {
        this.object = object;
        this.start = start;
        this.end = end;
        this.ax = GEO.rad(ax);
        this.ay = GEO.rad(ay);
        this.az = GEO.rad(az);
    }

    run(time, dt) {
        if (time > this.start && time < this.end) {
            var div = dt / (this.end - this.start);
            this.object.rotate(this.ax * div, this.ay * div, this.az * div);
        }
    }
}

class ScaleAnimation {
    object;
    start;
    end;
    kx; ky; kz;
    curr_x = 1.0; curr_y = 1.0; curr_z = 1.0;

    constructor(object, start, end, kx, ky, kz) {
        this.object = object;
        this.start = start;
        this.end = end;
        this.kx = kx;
        this.ky = ky;
        this.kz = kz;
    }

    run(time, dt) {
        if (time > this.start && time < this.end) {
            var div = dt / (this.end - this.start);
            this.object.scale(1 / this.curr_x, 1 / this.curr_y, 1 / this.curr_z);
            this.curr_x += (this.kx - 1.0) * div;
            this.curr_y += (this.ky - 1.0) * div;
            this.curr_z += (this.kz - 1.0) * div;
            this.object.scale(this.curr_x, this.curr_y, this.curr_z);

        }
    }
}

class ArbitraryAxisRotationAnimation {
    // Parameters
    object;
    start;
    end;
    m1; m2; m3;
    theta;

    constructor(object, start, end, m1, m2, m3, theta) {
        this.object = object;
        this.start = start;
        this.end = end;
        this.m1 = m1;
        this.m2 = m2;
        this.m3 = m3;
        this.theta = GEO.rad(theta);
    }

    run(time, dt) {
        if (time > this.start && time < this.end) {
            var div = dt / (this.end - this.start);
            this.object.rotateArbitraryAxis(this.m1, this.m2, this.m3, this.theta * div);
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
        for (let i = 0; i < this.animations.length; i++) {
            this.start = Math.min(this.start, this.animations[i].start);
            this.end = Math.max(this.end, this.animations[i].end);
        }
    }

    run(time, dt) {
        if (time > this.start && time < this.end) {
            for (let animation of this.animations) {
                animation.run(time, dt);
            }
        }
        if (time > this.end && this.isLoop) {
            let duration = this.end - this.start + 2 * dt;
            this.start += duration;
            this.end += duration;
            for (let i = 0; i < this.animations.length; i++) {
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
        for (let i = 0; i < this.animations.length; i++) {
            let offset = this.start * (1 - x);
            this.animations[i].start *= x;
            this.animations[i].end *= x;
            this.animations[i].start += offset;
            this.animations[i].end += offset;
            this.end = Math.max(this.end, this.animations[i].end);
        }
    }
}