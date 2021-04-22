import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProductCodeDetailComponent } from './product-code-detail.component';

describe('Component Tests', () => {
  describe('ProductCode Management Detail Component', () => {
    let comp: ProductCodeDetailComponent;
    let fixture: ComponentFixture<ProductCodeDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ProductCodeDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ productCode: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ProductCodeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ProductCodeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load productCode on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.productCode).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
