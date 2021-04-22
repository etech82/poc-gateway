import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LocationOrderService } from '../service/location-order.service';

import { LocationOrderComponent } from './location-order.component';

describe('Component Tests', () => {
  describe('LocationOrder Management Component', () => {
    let comp: LocationOrderComponent;
    let fixture: ComponentFixture<LocationOrderComponent>;
    let service: LocationOrderService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LocationOrderComponent],
      })
        .overrideTemplate(LocationOrderComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LocationOrderComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(LocationOrderService);

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
      expect(comp.locationOrders?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
