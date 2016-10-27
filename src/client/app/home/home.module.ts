import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home.component';
import {MapValuesPipe} from "../shared/map-values.pipe";

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [HomeComponent, MapValuesPipe],
  exports: [HomeComponent],
})
export class HomeModule { }
