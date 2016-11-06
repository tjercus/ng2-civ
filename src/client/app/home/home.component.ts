import { Component, OnInit, DoCheck } from '@angular/core';
import {Settler, SailBoat, City} from "../shared/units";
import {Game, Coord, Tile, Board, Direction, Land} from "../shared/world";

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
  public year: number = 1;

  private selectedTile: Tile = null;
  private board: Board = new Board(5); // TODO use as a properly observed angular service?
  private game: Game = new Game();


  constructor() {}

  /**
   * Get the board OnInit
   */
  ngOnInit() {
    this.board.placeUnit(Coord.create(2,3), new Settler());
    this.board.placeUnit(Coord.create(2,0), new SailBoat());
    this.grid = this.board.grid;
    this.year = this.game.year;
  }

  /**
   * Angular2 does not completely understand when the grid needs reloading,
   *  so this method forces a reload of the grid
   */
  ngDoCheck() {
    this.grid = this.board.grid;
    this.year = this.game.year;
  }

  setCssClasses(tile: Tile) {
    return {
      "tile-selected": this.isSelected(tile),
      "surface-sea": tile.surface.name === "Sea",
      "surface-land": tile.surface.name === "Land",
    }
  }

  isSelected(tile: Tile): boolean {
    return this.selectedTile !== null && this.selectedTile.equals(tile);
  }

  onSelectTileClick(tile: Tile) {
    this.selectedTile = tile;
    console.log(`HomeComponent onSelectTileClick ${tile.toString()}`);
  }

  toggleContextMenu() {
    return this.selectedTile && this.selectedTile.unit &&this.selectedTile.unit.constructor.name === 'Settler';
  }

  onUpClick() {
    this.selectedTile = this.board.moveUnit(this.selectedTile, Direction.Up);
  }
  onRightClick() {
    this.selectedTile = this.board.moveUnit(this.selectedTile, Direction.Right);
  }
  onDownClick() {
    this.selectedTile = this.board.moveUnit(this.selectedTile, Direction.Down);
  }
  onLeftClick() {
    this.selectedTile = this.board.moveUnit(this.selectedTile, Direction.Left);
  }

  onBuildRoadClick() {
    this.board.placeRoad(this.selectedTile.coord);
  }
  onBuildCityClick() {
    this.board.placeCity(this.selectedTile.coord, new City());
  }
}
