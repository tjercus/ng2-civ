// units.ts 
"use strict";
// Or: implements Mappable extends Unit
var Land = (function () {
    function Land() {
        this.name = "Land";
        console.log("name is " + this.name);
    }
    return Land;
}());
exports.Land = Land;
var Sea = (function () {
    function Sea() {
        this.name = "Sea";
    }
    return Sea;
}());
exports.Sea = Sea;
var Settler = (function () {
    function Settler() {
        this.name = "Settler";
    }
    return Settler;
}());
exports.Settler = Settler;
//# sourceMappingURL=units.js.map