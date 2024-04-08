var GEO = {
    createBox: function (width, length, height, color) {
        var hw = width / 2.0;
        var hl = length / 2.0;
        var hh = height / 2.0;
        var vertices = [
            hw, hh, hl, ...color,
            -hw, hh, hl, ...color,
            hw, -hh, hl, ...color,
            -hw, -hh, hl, ...color,
            hw, hh, -hl, ...color,
            -hw, hh, -hl, ...color,
            hw, -hh, -hl, ...color,
            -hw, -hh, -hl, ...color,
        ];
        var faces = [
            0, 1, 2,
            1, 2, 3,
            4, 5, 6,
            5, 6, 7,
            0, 4, 5,
            0, 1, 5,
            0, 4, 6,
            0, 2, 6,
            2, 6, 7,
            2, 3, 7,
            1, 5, 7,
            1, 3, 7,
        ];
        return { vertices: vertices, faces: faces };
    },
    createCylinder: function (radius, height, poly, color) {
        var hh = height / 2.0;
        var vertices = [];
        for (let i = 0; i < poly; i++) {
            let rad = i * 360 / poly * Math.PI / 180.0;
            vertices.push(radius * Math.cos(rad), hh, radius * Math.sin(rad), ...color);
        }
        for (let i = 0; i < poly; i++) {
            let rad = i * 360 / poly * Math.PI / 180.0;
            vertices.push(radius * Math.cos(rad), -hh, radius * Math.sin(rad), ...color);
        }
        vertices.push(
            0, hh, 0, ...color,
            0, -hh, 0, ...color
        );

        var faces = [];
        for (let i = 0; i < poly; i++) {
            faces.push(i, (i + 1) % poly, 2 * poly);
            faces.push(i, (i + 1) % poly, i + poly);
        }
        for (let i = 0; i < poly; i++) {
            faces.push(i + poly, (i + 1) % poly + poly, 2 * poly + 1);
            faces.push(i + poly, (i + 1) % poly + poly, (i + 1) % poly);
        }
        return { vertices: vertices, faces: faces };
    },
    createSphere: function (radius, poly, color) {
        let sectorCount = poly;
        let stackCount = poly;

        let x, y, z, xy;
        let sectorStep = 2 * Math.PI / sectorCount;
        let stackStep = Math.PI / stackCount;
        let sectorAngle, stackAngle;
        let vertices = [];
        for (let i = 0; i <= stackCount; ++i) {
            stackAngle = Math.PI / 2 - i * stackStep;
            xy = radius * Math.cos(stackAngle);
            z = radius * Math.sin(stackAngle);
            for (let j = 0; j <= sectorCount; ++j) {
                sectorAngle = j * sectorStep;
                x = xy * Math.cos(sectorAngle);
                y = xy * Math.sin(sectorAngle);
                vertices.push(x);
                vertices.push(y);
                vertices.push(z);
                vertices.push(...color);
            }
        }

        let k1, k2;
        var faces = [];
        for (let i = 0; i < stackCount; ++i) {
            k1 = i * (sectorCount + 1);
            k2 = k1 + sectorCount + 1;
            for (let j = 0; j < sectorCount; ++j, ++k1, ++k2) {
                if (i != 0) {
                    faces.push(k1);
                    faces.push(k2);
                    faces.push(k1 + 1);
                }
                if (i != (stackCount - 1)) {
                    faces.push(k1 + 1);
                    faces.push(k2);
                    faces.push(k2 + 1);
                }
            }
        }
        return { vertices: vertices, faces: faces };
    },
    createCurve: function (controlPoints, m, degree) {
        var curves = [];
        var knotVector = []
        var n = controlPoints.length / 3;
        for (var i = 0; i < n + degree + 1; i++) {
            if (i < degree + 1) {
                knotVector.push(0);
            } else if (i >= n) {
                knotVector.push(n - degree);
            } else {
                knotVector.push(i - degree);
            }
        }
        var basisFunc = function (i, j, t) {
            if (j == 0) {
                if (knotVector[i] <= t && t < (knotVector[(i + 1)])) {
                    return 1;
                } else {
                    return 0;
                }
            }
            var den1 = knotVector[i + j] - knotVector[i];
            var den2 = knotVector[i + j + 1] - knotVector[i + 1];
            var term1 = 0;
            var term2 = 0;
            if (den1 != 0 && !isNaN(den1)) {
                term1 = ((t - knotVector[i]) / den1) * basisFunc(i, j - 1, t);
            }
            if (den2 != 0 && !isNaN(den2)) {
                term2 = ((knotVector[i + j + 1] - t) / den2) * basisFunc(i + 1, j - 1, t);
            }
            return term1 + term2;
        }

        for (var t = 0; t < m; t++) {
            var x = 0;
            var y = 0;
            var z = 0;
            var u = (t / m * (knotVector[controlPoints.length / 3] - knotVector[degree])) + knotVector[degree];
            for (var key = 0; key < n; key++) {
                var C = basisFunc(key, degree, u);
                x += (controlPoints[key * 3] * C);
                y += (controlPoints[key * 3 + 1] * C);
                z += (controlPoints[key * 3 + 2] * C);
            }
            curves.push(x);
            curves.push(y);
            curves.push(z);
        }
        return curves;
    },
    createHyperboloidOneSheet: function (radius, height, poly, color) {
        let sectorCount = poly;
        let stackCount = poly;

        let x, y, z, xz;
        let sectorStep = 2 * Math.PI / sectorCount;
        let stackStep = Math.PI / stackCount;
        let sectorAngle, stackAngle;
        let vertices = [];
        for (let i = 0; i <= stackCount; ++i) {
            stackAngle = Math.PI / 2 - i * stackStep;
            xz = radius * Math.cosh(stackAngle);
            y = height * Math.sinh(stackAngle);
            for (let j = 0; j <= sectorCount; ++j) {
                sectorAngle = j * sectorStep;
                x = xz * Math.cos(sectorAngle);
                z = xz * Math.sin(sectorAngle);
                vertices.push(x);
                vertices.push(y);
                vertices.push(z);
                vertices.push(...color);
            }
        }
        let k1, k2;
        var faces = [];
        for (let i = 0; i < stackCount; ++i) {
            k1 = i * (sectorCount + 1);
            k2 = k1 + sectorCount + 1;
            for (let j = 0; j < sectorCount; ++j, ++k1, ++k2) {
                faces.push(k1);
                faces.push(k2);
                faces.push(k1 + 1);
                faces.push(k1 + 1);
                faces.push(k2);
                faces.push(k2 + 1);
            }
        }
        return { vertices: vertices, faces: faces };
    },
    createEllipticParaboloid: function (radius, poly, color) {
        let sectorCount = poly;
        let stackCount = poly;

        let x, y, z, xz;
        let sectorStep = 2 * Math.PI / sectorCount;
        let stackStep = Math.PI / stackCount;
        let sectorAngle, stackAngle;
        let vertices = [];
        for (let i = 0; i <= stackCount; ++i) {
            stackAngle = Math.PI / 2 - i * stackStep;
            xz = radius * Math.sqrt(stackAngle);
            y = -stackAngle;
            for (let j = 0; j <= sectorCount; ++j) {
                sectorAngle = j * sectorStep;
                x = xz * Math.cos(sectorAngle);
                z = xz * Math.sin(sectorAngle);
                vertices.push(x);
                vertices.push(y);
                vertices.push(z);
                vertices.push(...color);
            }
        }
        let k1, k2;
        var faces = [];
        for (let i = 0; i < stackCount; ++i) {
            k1 = i * (sectorCount + 1);
            k2 = k1 + sectorCount + 1;
            for (let j = 0; j < sectorCount; ++j, ++k1, ++k2) {
                faces.push(k1);
                faces.push(k2);
                faces.push(k1 + 1);
                faces.push(k1 + 1);
                faces.push(k2);
                faces.push(k2 + 1);
            }
        }
        return { vertices: vertices, faces: faces };
    },
}