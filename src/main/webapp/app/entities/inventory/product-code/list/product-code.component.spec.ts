import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ProductCodeService } from '../service/product-code.service';

import { ProductCodeComponent } from './product-code.component';

describe('Component Tests', () => {
  describe('ProductCode Management Component', () => {
    let comp: ProductCodeComponent;
    let fixture: ComponentFixture<ProductCodeComponent>;
    let service: ProductCodeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProductCodeComponent],
      })
        .overrideTemplate(ProductCodeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProductCodeComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ProductCodeService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.productCodes?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
