import { Component, OnInit, DoCheck } from '@angular/core';
import {Settler, City, SailBoat} from "../shared/units";
import {Game, Tile, Board, Direction, Land, Sea} from "../shared/world";

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

  public tiles: Array<Tile> = [];
  public grid: Array<Array<Tile>> = [[]];

  private board: Board = new Board(5); // TODO use as a properly observed angular service?
  public game: Game = new Game(this.board);

  constructor() {}

  /**
   * Get the board OnInit
   */
  ngOnInit() {
    this.grid = this.board.grid;
  }

  /**
   * Angular2 does not completely understand when the grid needs reloading,
   *  so this method forces a reload of the grid
   */
  ngDoCheck() {
    this.grid = this.board.grid;
  }

  setCssClasses(tile: Tile): Object {
    return {
      "tile-selected": this.isSelected(tile),
      "surface-sea": tile.surface instanceof Sea,
      "surface-land": tile.surface instanceof Land,
    }
  }

  getTileImagePath(tile: Tile): string {
    if (tile.unit instanceof Settler) {
      return "./assets/unit-settler.png";
    }
    if (tile.unit instanceof SailBoat) {
      return "./assets/unit-sailboat.png";
    }
    if (tile.surface instanceof Sea) {
      return "./assets/tile-sea.png";
    }
    if (tile.surface instanceof Land && tile.surface.hasRoad) {
      return "./assets/tile-grass-road.png";
    }
    if (tile.surface instanceof Land) {
      return "./assets/tile-grass.png";
    }

    return "";
    // TODO City
    // TODO Mountain etc.
  }

  isSelected(tile: Tile): boolean {
    return this.board.activeTile !== null && this.board.activeTile.equals(tile);
  }

  onSelectTileClick(tile: Tile) {
    this.board.activeTile = tile;
    console.log(`HomeComponent onSelectTileClick ${tile.toString()}`);
  }

  toggleContextMenu() {
    return this.board.activeTile &&
      this.board.activeTile.unit &&
      this.board.activeTile.unit instanceof Settler;
  }

  onUpClick() {
    this.board.activeTile = this.board.moveUnit(this.board.activeTile, Direction.Up);
  }
  onRightClick() {
    this.board.activeTile = this.board.moveUnit(this.board.activeTile, Direction.Right);
  }
  onDownClick() {
    this.board.activeTile = this.board.moveUnit(this.board.activeTile, Direction.Down);
  }
  onLeftClick() {
    this.board.activeTile = this.board.moveUnit(this.board.activeTile, Direction.Left);
  }

  onBuildRoadClick() {
    // TODO prevent double click
    this.board.buildRoad(this.board.activeTile.coord, this.game.year);
  }
  onBuildCityClick() {
    // TODO prevent double click
    this.board.buildCity(this.board.activeTile.coord, this.game.year);
  }

  onEndTurnClick() {
    this.game.endTurn();
  }
}
