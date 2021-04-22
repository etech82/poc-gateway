import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { OrderItemService } from '../service/order-item.service';

import { OrderItemComponent } from './order-item.component';

describe('Component Tests', () => {
  describe('OrderItem Management Component', () => {
    let comp: OrderItemComponent;
    let fixture: ComponentFixture<OrderItemComponent>;
    let service: OrderItemService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [OrderItemComponent],
      })
        .overrideTemplate(OrderItemComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OrderItemComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(OrderItemService);

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
      expect(comp.orderItems?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
