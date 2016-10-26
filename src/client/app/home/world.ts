 
 /**
 * x = horizontal
 * y = vertical
 */
 export class Coord {
 	readonly x: number;
 	readonly y: number;

 	constructor(x: number, y: number) {
 		this.x = x;
 		this.y = y;
 	}
 	
 	public equals(otherCoord: Coord): boolean {
 		return (this.x === otherCoord.x && this.y === otherCoord.y);
 	}

 	public toString(): string {
 		return `${this.x},${this.y}`;
 	}
 } 