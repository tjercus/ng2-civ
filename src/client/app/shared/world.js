"use strict";
/**
* x = horizontal
* y = vertical
*/
var Coord = (function () {
    function Coord(x, y) {
        this.x = x;
        this.y = y;
    }
    Coord.prototype.equals = function (otherCoord) {
        return (this.x === otherCoord.x && this.y === otherCoord.y);
    };
    Coord.prototype.toString = function () {
        return this.x + "," + this.y;
    };
    return Coord;
}());
exports.Coord = Coord;
//# sourceMappingURL=world.js.map