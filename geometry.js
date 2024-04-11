var GEO = {
    rad: function (deg) {
        return deg * Math.PI / 180.0;
    },
    createBox: function (width, length, height, color) {
        var hw = width / 2.0;
        var hl = length / 2.0;
        var hh = height / 2.0;
        var vertices = [
            hw, hh, hl, 0, 0, 1, ...color,
            -hw, hh, hl, 0, 0, 1, ...color,
            hw, -hh, hl, 0, 0, 1, ...color,
            -hw, -hh, hl, 0, 0, 1, ...color,

            hw, hh, -hl, 0, 0, -1, ...color,
            -hw, hh, -hl, 0, 0, -1, ...color,
            hw, -hh, -hl, 0, 0, -1, ...color,
            -hw, -hh, -hl, 0, 0, -1, ...color,

            hw, hh, hl, 0, 1, 0, ...color,
            -hw, hh, hl, 0, 1, 0, ...color,
            hw, hh, -hl, 0, 1, 0, ...color,
            -hw, hh, -hl, 0, 1, 0, ...color,

            hw, -hh, hl, 0, -1, 0, ...color,
            -hw, -hh, hl, 0, -1, 0, ...color,
            hw, -hh, -hl, 0, -1, 0, ...color,
            -hw, -hh, -hl, 0, -1, 0, ...color,

            hw, hh, hl, 1, 0, 0, ...color,
            hw, -hh, hl, 1, 0, 0,  ...color,
            hw, hh, -hl, 1, 0, 0,  ...color,
            hw, -hh, -hl, 1, 0, 0,  ...color,

            -hw, hh, hl, -1, 0, 0,  ...color,
            -hw, -hh, hl, -1, 0, 0, ...color,
            -hw, hh, -hl, -1, 0, 0, ...color,
            -hw, -hh, -hl, -1, 0, 0, ...color,
        ];
        var faces = [
            0, 1, 2,
            1, 2, 3,
            4, 5, 6,
            5, 6, 7,
            8, 9, 10,
            9, 10, 11,
            12, 13, 14,
            13, 14, 15,
            16, 17, 18,
            17, 18, 19,
            20, 21, 22,
            21, 22, 23,
        ];
        return { vertices: vertices, faces: faces };
    },
    createCylinder: function (radius, height, poly, color) {
        var hh = height / 2.0;
        var vertices = [];

        for (let i = 0; i < poly; i++) {
            let rad = i * 360 / poly * Math.PI / 180.0;
            vertices.push(radius * Math.cos(rad), hh, radius * Math.sin(rad), 0, 1, 0, ...color);
        }
        for (let i = 0; i < poly; i++) {
            let rad = i * 360 / poly * Math.PI / 180.0;
            vertices.push(radius * Math.cos(rad), -hh, radius * Math.sin(rad), Math.cos(rad), 0, Math.sin(rad), ...color);
        }
        for (let i = 0; i < poly; i++) {
            let rad = i * 360 / poly * Math.PI / 180.0;
            vertices.push(radius * Math.cos(rad), hh, radius * Math.sin(rad), 0, -1, 0, ...color);
        }
        for (let i = 0; i < poly; i++) {
            let rad = i * 360 / poly * Math.PI / 180.0;
            vertices.push(radius * Math.cos(rad), -hh, radius * Math.sin(rad), Math.cos(rad), 0, Math.sin(rad), ...color);
        }

        vertices.push(0, hh, 0, 0, 1, 0, ...color);
        vertices.push(0, -hh, 0, 0, -1, 0, ...color);

        var faces = [];
        for (let i = 0; i < poly; i++) {
            faces.push(i, (i + 1) % poly, 4 * poly);
            faces.push(i + 2 * poly, (i + 1) % poly + 2 * poly, i + 3 * poly);
        }
        for (let i = 0; i < poly; i++) {
            faces.push(i + poly, (i + 1) % poly + poly, 4 * poly + 1);
            faces.push(i + 3 * poly, (i + 1) % poly + 3 * poly, (i + 1) % poly + 2 * poly);
        }
        return { vertices: vertices, faces: faces };
    },
    createSphere: function (radius, poly, color) {
        let sectorCount = poly;
        let stackCount = poly;

        let x, y, z, xy;
        let nx, ny, nz, lengthInv = 1.0 / radius;
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

                nx = x * lengthInv;
                ny = y * lengthInv;
                nz = z * lengthInv;
                vertices.push(nx);
                vertices.push(ny);
                vertices.push(nz);

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
    createHyperboloidOneSheet: function (radius, height, poly, color) {
        let sectorCount = poly;
        let stackCount = poly;

        let x, y, z, xz;
        let nx, ny, nz, lengthInv = 1.0 / radius;
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

                nx = x * lengthInv;
                ny = y * lengthInv;
                nz = z * lengthInv;
                vertices.push(nx);
                vertices.push(ny);
                vertices.push(nz);

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
    createEllipticParaboloid: function (radius, height, poly, color) {
        let sectorCount = poly;
        let stackCount = poly;

        let x, y, z, xz;
        let nx, ny, nz, lengthInv = 1.0 / radius;
        let sectorStep = 2 * Math.PI / sectorCount;
        let stackStep = Math.PI / stackCount;
        let sectorAngle, stackAngle;
        let vertices = [];
        for (let i = 0; i <= stackCount; ++i) {
            stackAngle = Math.PI / 2 - i * stackStep;
            xz = radius * Math.sqrt(stackAngle);
            y = height * -stackAngle;
            for (let j = 0; j <= sectorCount; ++j) {
                sectorAngle = j * sectorStep;
                x = xz * Math.cos(sectorAngle);
                z = xz * Math.sin(sectorAngle);
                vertices.push(x);
                vertices.push(y);
                vertices.push(z);

                nx = x * lengthInv;
                ny = y * lengthInv;
                nz = z * lengthInv;
                vertices.push(nx);
                vertices.push(ny);
                vertices.push(nz);

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
    combineLines: function (color, ...lines) {
        let vertices = [];
        let faces = [];

        for (let i = 0; i < lines[0].length / 3; i++) {
            for (let j = 0; j < lines.length; j++) {
                let currpoint = [
                    lines[j][i * 3],
                    lines[j][i * 3 + 1],
                    lines[j][i * 3 + 2]
                ];
                let sidepoint = [
                    lines[(j + 1) % lines.length][i * 3],
                    lines[(j + 1) % lines.length][i * 3 + 1],
                    lines[(j + 1) % lines.length][i * 3 + 2]
                ];
                let normal = glMatrix.vec3.create();
                if (i != lines[0].length - 1) {
                    let nextpoint = [
                        lines[j][(i + 1) * 3],
                        lines[j][(i + 1) * 3 + 1],
                        lines[j][(i + 1) * 3 + 2]
                    ];
                    
                    let currIndex = vertices.length / 9;
                    glMatrix.vec3.cross(
                        normal,
                        [currpoint[0] - sidepoint[0], currpoint[1] - sidepoint[1], currpoint[2] - sidepoint[2]],
                        [currpoint[0] - nextpoint[0], currpoint[1] - nextpoint[1], currpoint[2] - nextpoint[2]]
                    );
                    glMatrix.vec3.normalize(normal, normal);
                    vertices.push(...currpoint, ...normal, ...color);
                    vertices.push(...sidepoint, ...normal, ...color);
                    vertices.push(...nextpoint, ...normal, ...color);
                    faces.push(currIndex, currIndex + 1, currIndex + 2);

                    currIndex = vertices.length / 9;
                    glMatrix.vec3.cross(
                        normal,
                        [currpoint[0] - nextpoint[0], currpoint[1] - nextpoint[1], currpoint[2] - nextpoint[2]],
                        [currpoint[0] - sidepoint[0], currpoint[1] - sidepoint[1], currpoint[2] - sidepoint[2]]
                    );
                    glMatrix.vec3.normalize(normal, normal);
                    vertices.push(...currpoint, ...normal, ...color);
                    vertices.push(...sidepoint, ...normal, ...color);
                    vertices.push(...nextpoint, ...normal, ...color);
                    faces.push(currIndex, currIndex + 1, currIndex + 2);
                }
                if(i != 0) {
                    let nextpoint = [
                        lines[(j + 1) % lines.length][(i - 1) * 3],
                        lines[(j + 1) % lines.length][(i - 1) * 3 + 1],
                        lines[(j + 1) % lines.length][(i - 1) * 3 + 2]
                    ];

                    let currIndex = vertices.length / 9;
                    glMatrix.vec3.cross(
                        normal,
                        [sidepoint[0] - currpoint[0], sidepoint[1] - currpoint[1], sidepoint[2] - currpoint[2]],
                        [sidepoint[0] - nextpoint[0], sidepoint[1] - nextpoint[1], sidepoint[2] - nextpoint[2]]
                    );
                    glMatrix.vec3.normalize(normal, normal);
                    vertices.push(...currpoint, ...normal, ...color);
                    vertices.push(...sidepoint, ...normal, ...color);
                    vertices.push(...nextpoint, ...normal, ...color);
                    faces.push(currIndex, currIndex + 1, currIndex + 2);

                    currIndex = vertices.length / 9;
                    glMatrix.vec3.cross(
                        normal,
                        [sidepoint[0] - nextpoint[0], sidepoint[1] - nextpoint[1], sidepoint[2] - nextpoint[2]],
                        [sidepoint[0] - currpoint[0], sidepoint[1] - currpoint[1], sidepoint[2] - currpoint[2]],
                    );
                    glMatrix.vec3.normalize(normal, normal);
                    vertices.push(...currpoint, ...normal, ...color);
                    vertices.push(...sidepoint, ...normal, ...color);
                    vertices.push(...nextpoint, ...normal, ...color);
                    faces.push(currIndex, currIndex + 1, currIndex + 2);
                }
            }
        }
        return { vertices: vertices, faces: faces };
    },
    loadTexture: function (image_URL) {
        var texture = GL.createTexture();
        var image = new Image();
        image.src = image_URL;
        image.onload = function (e) {
            GL.bindTexture(GL.TEXTURE_2D, texture);
            GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
            GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image);
            // GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
            // GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
            // GL.generateMipmap(GL.TEXTURE_2D);

            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
            // GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.REPEAT);
            // GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.MIRRORED_REPEAT);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);

            // GL.generateMipmap(GL.TEXTURE_2D);
            GL.bindTexture(GL.TEXTURE_2D, null);
        };
        return texture;
    },
    get_json: function (url, func) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, true);
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                func(JSON.parse(xmlHttp.responseText));
            }
        };
        xmlHttp.send();
    },
}