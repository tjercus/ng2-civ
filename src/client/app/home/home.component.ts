import { Component, OnInit } from '@angular/core';
import { NameListService } from '../shared/index';
import {Map, List} from "immutable";
import {Land, Sea, Settler} from "./units";
import {Coord} from "./world";

import {MapValuesPipe} from "../shared/map-values.pipe";

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  pipes: [MapValuesPipe]
})

export class HomeComponent implements OnInit {

  errorMessage: string;
  // x = horizontal
  // y = vertical
  tiles: Immutable.Map<Unit> = {
    new Coord(0,0): new Land(),
    new Coord(1,0): new Land(),
    new Coord(2,0): new Land(),

  };
  //unitPos: number = 2;

  /**
   *
   */
  constructor() {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    
  }

  /**
  * 
  */
  onUpClick() {

  }

}
