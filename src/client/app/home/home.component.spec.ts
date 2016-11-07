import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
  async
} from "@angular/core/testing";
import {
  BaseRequestOptions,
  ConnectionBackend,
  Http, HttpModule
} from "@angular/http";
import { MockBackend } from "@angular/http/testing";
import { HomeModule } from "./home.module";

export function main() {
  describe("Home component", () => {
    // setting module for testing
    // Disable old forms
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, RouterModule, HttpModule, HomeModule],
        declarations: [TestComponent],
        providers: [
          BaseRequestOptions,
          MockBackend,
          {provide: Http, useFactory: function (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
              return new Http(backend, defaultOptions);
            },
            deps: [MockBackend, BaseRequestOptions]
          },
        ]
      });
    });

    it("should work",
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();

            //let homeInstance = fixture.debugElement.children[0].componentInstance;
            let homeDOMEl = fixture.debugElement.children[0].nativeElement;
            const btn = fixture.debugElement.query(By.css('button'));

            expect(homeDOMEl.querySelectorAll("tr").length).toEqual(5);
            expect(homeDOMEl.querySelectorAll("td").length).toEqual(20);
            //onLeftClick(btn);
            // click(btn);
            fixture.detectChanges();
            expect(homeDOMEl.querySelectorAll("td")[0].textContent).toContain("[0,0] U: f, R: false, C: f");
            expect(homeDOMEl.querySelectorAll("td[data-coord='2,3']")[0].textContent).toContain("Settler");
            // TODO build City, move Settler and assert City is still on first Tile

          });

      }));
  });
}

@Component({
  selector: "test-cmp",
  template: "<sd-home></sd-home>"
})
class TestComponent { }
