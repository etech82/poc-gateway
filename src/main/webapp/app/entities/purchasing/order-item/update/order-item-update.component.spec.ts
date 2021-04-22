jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { OrderItemService } from '../service/order-item.service';
import { IOrderItem, OrderItem } from '../order-item.model';
import { ILocationOrder } from 'app/entities/purchasing/location-order/location-order.model';
import { LocationOrderService } from 'app/entities/purchasing/location-order/service/location-order.service';

import { OrderItemUpdateComponent } from './order-item-update.component';

describe('Component Tests', () => {
  describe('OrderItem Management Update Component', () => {
    let comp: OrderItemUpdateComponent;
    let fixture: ComponentFixture<OrderItemUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let orderItemService: OrderItemService;
    let locationOrderService: LocationOrderService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [OrderItemUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(OrderItemUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OrderItemUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      orderItemService = TestBed.inject(OrderItemService);
      locationOrderService = TestBed.inject(LocationOrderService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call LocationOrder query and add missing value', () => {
        const orderItem: IOrderItem = { id: 456 };
        const locationOrder: ILocationOrder = { id: 4120 };
        orderItem.locationOrder = locationOrder;

        const locationOrderCollection: ILocationOrder[] = [{ id: 29526 }];
        spyOn(locationOrderService, 'query').and.returnValue(of(new HttpResponse({ body: locationOrderCollection })));
        const additionalLocationOrders = [locationOrder];
        const expectedCollection: ILocationOrder[] = [...additionalLocationOrders, ...locationOrderCollection];
        spyOn(locationOrderService, 'addLocationOrderToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ orderItem });
        comp.ngOnInit();

        expect(locationOrderService.query).toHaveBeenCalled();
        expect(locationOrderService.addLocationOrderToCollectionIfMissing).toHaveBeenCalledWith(
          locationOrderCollection,
          ...additionalLocationOrders
        );
        expect(comp.locationOrdersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const orderItem: IOrderItem = { id: 456 };
        const locationOrder: ILocationOrder = { id: 19212 };
        orderItem.locationOrder = locationOrder;

        activatedRoute.data = of({ orderItem });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(orderItem));
        expect(comp.locationOrdersSharedCollection).toContain(locationOrder);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const orderItem = { id: 123 };
        spyOn(orderItemService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ orderItem });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: orderItem }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(orderItemService.update).toHaveBeenCalledWith(orderItem);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const orderItem = new OrderItem();
        spyOn(orderItemService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ orderItem });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: orderItem }));
        saveSubject.complete();

        // THEN
        expect(orderItemService.create).toHaveBeenCalledWith(orderItem);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const orderItem = { id: 123 };
        spyOn(orderItemService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ orderItem });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(orderItemService.update).toHaveBeenCalledWith(orderItem);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackLocationOrderById', () => {
        it('Should return tracked LocationOrder primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackLocationOrderById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
