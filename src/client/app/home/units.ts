// units.ts 

interface Unit {}

// Or: implements Mappable extends Unit
export class Land implements Unit {
	constructor() {
		console.log(`name is ${this.name}`);
	}
	public name: string = "Land";
}

export class Sea implements Unit {
	public name: string = "Sea"; 
}

export class Settler implements Unit {
	public name: string = "Settler";
}