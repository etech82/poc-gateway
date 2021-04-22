import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LocationOrderDetailComponent } from './location-order-detail.component';

describe('Component Tests', () => {
  describe('LocationOrder Management Detail Component', () => {
    let comp: LocationOrderDetailComponent;
    let fixture: ComponentFixture<LocationOrderDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [LocationOrderDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ locationOrder: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(LocationOrderDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(LocationOrderDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load locationOrder on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.locationOrder).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
