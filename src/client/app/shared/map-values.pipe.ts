import {Pipe, PipeTransform} from '@angular/core';
import {Coord} from "../home/world";
import {Unit, Tile} from "../home/units";

@Pipe({name: 'unitToTile'})
export class MapValuesPipe implements PipeTransform {
  transform(value: Map<Coord, Unit>, args?: Array<Object>): Array<Tile> {
    let returnArray: Array<Tile> = [];

    value.forEach((entryVal, entryKey) => {
      // returnArray.push({
      //   key: entryKey,
      //   val: entryVal
      // });
      returnArray.push(new Tile(entryKey, entryVal));
    });

    return returnArray;
  }
}