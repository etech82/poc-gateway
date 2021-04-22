jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { LocationOrderService } from '../service/location-order.service';
import { ILocationOrder, LocationOrder } from '../location-order.model';
import { ILocation } from 'app/entities/purchasing/location/location.model';
import { LocationService } from 'app/entities/purchasing/location/service/location.service';

import { LocationOrderUpdateComponent } from './location-order-update.component';

describe('Component Tests', () => {
  describe('LocationOrder Management Update Component', () => {
    let comp: LocationOrderUpdateComponent;
    let fixture: ComponentFixture<LocationOrderUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let locationOrderService: LocationOrderService;
    let locationService: LocationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LocationOrderUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(LocationOrderUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LocationOrderUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      locationOrderService = TestBed.inject(LocationOrderService);
      locationService = TestBed.inject(LocationService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Location query and add missing value', () => {
        const locationOrder: ILocationOrder = { id: 456 };
        const location: ILocation = { id: 65329 };
        locationOrder.location = location;

        const locationCollection: ILocation[] = [{ id: 73788 }];
        spyOn(locationService, 'query').and.returnValue(of(new HttpResponse({ body: locationCollection })));
        const additionalLocations = [location];
        const expectedCollection: ILocation[] = [...additionalLocations, ...locationCollection];
        spyOn(locationService, 'addLocationToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ locationOrder });
        comp.ngOnInit();

        expect(locationService.query).toHaveBeenCalled();
        expect(locationService.addLocationToCollectionIfMissing).toHaveBeenCalledWith(locationCollection, ...additionalLocations);
        expect(comp.locationsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const locationOrder: ILocationOrder = { id: 456 };
        const location: ILocation = { id: 22113 };
        locationOrder.location = location;

        activatedRoute.data = of({ locationOrder });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(locationOrder));
        expect(comp.locationsSharedCollection).toContain(location);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const locationOrder = { id: 123 };
        spyOn(locationOrderService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ locationOrder });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: locationOrder }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(locationOrderService.update).toHaveBeenCalledWith(locationOrder);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const locationOrder = new LocationOrder();
        spyOn(locationOrderService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ locationOrder });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: locationOrder }));
        saveSubject.complete();

        // THEN
        expect(locationOrderService.create).toHaveBeenCalledWith(locationOrder);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const locationOrder = { id: 123 };
        spyOn(locationOrderService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ locationOrder });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(locationOrderService.update).toHaveBeenCalledWith(locationOrder);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackLocationById', () => {
        it('Should return tracked Location primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackLocationById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
