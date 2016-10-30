import {Pipe, PipeTransform} from '@angular/core';
import {Coord, Tile} from "../home/world";


@Pipe({name: 'mapToTile'})
export class MapValuesPipe implements PipeTransform {
  transform(value: Map<String, Tile>, args?: Array<Object>): Array<Tile> {
    let returnArray: Array<Tile> = new Array<Tile>();

    value.forEach((entryVal, entryKey) => {
      // returnArray.push({
      //   key: entryKey,
      //   val: entryVal
      // });
      returnArray.push(Tile.create(entryVal.coord, entryVal.surface, entryVal.unit));
    });

    return returnArray;
  }
}