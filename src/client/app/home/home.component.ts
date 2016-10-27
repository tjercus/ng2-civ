import { Component, OnInit } from '@angular/core';
import {Unit, Land, Sea, Settler} from "./units";
import {Coord} from "./world";

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})

export class HomeComponent implements OnInit {

  // errorMessage: string;
  // x = horizontal
  // y = vertical
  tiles: Map<Coord, Unit> = new Map<Coord, Unit>();
  selectedUnit: Unit = null;

  /**
   *
   */
  constructor() {
    this.tiles.set(new Coord(0,0), new Land());
    this.tiles.set(new Coord(1,0), new Land());
    this.tiles.set(new Coord(2,0), new Settler());
    this.tiles.set(new Coord(3,0), new Land());
    this.tiles.set(new Coord(4,0), new Land());
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
  }

  onSelectUnitClick(unit: Unit) {
    this.selectedUnit = unit;
    console.log(`HomeComponent onSelectUnitClick ${unit.toString()}`);
  }

  /**
  * 
  */
  onUpClick() {
    //this.tiles.get(this.selectedUnit.)
  }
  onRightClick() {}
  onDownClick() {}
  onLeftClick() {}
}
