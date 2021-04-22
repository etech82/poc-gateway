import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { OrderStatus } from 'app/entities/enumerations/order-status.model';
import { ILocationOrder, LocationOrder } from '../location-order.model';

import { LocationOrderService } from './location-order.service';

describe('Service Tests', () => {
  describe('LocationOrder Service', () => {
    let service: LocationOrderService;
    let httpMock: HttpTestingController;
    let elemDefault: ILocationOrder;
    let expectedResult: ILocationOrder | ILocationOrder[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(LocationOrderService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        code: 'AAAAAAA',
        placedDate: currentDate,
        status: OrderStatus.COMPLETED,
        invoiceId: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            placedDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a LocationOrder', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            placedDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            placedDate: currentDate,
          },
          returnedFromService
        );

        service.create(new LocationOrder()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a LocationOrder', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            code: 'BBBBBB',
            placedDate: currentDate.format(DATE_TIME_FORMAT),
            status: 'BBBBBB',
            invoiceId: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            placedDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a LocationOrder', () => {
        const patchObject = Object.assign(
          {
            status: 'BBBBBB',
          },
          new LocationOrder()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            placedDate: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of LocationOrder', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            code: 'BBBBBB',
            placedDate: currentDate.format(DATE_TIME_FORMAT),
            status: 'BBBBBB',
            invoiceId: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            placedDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a LocationOrder', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addLocationOrderToCollectionIfMissing', () => {
        it('should add a LocationOrder to an empty array', () => {
          const locationOrder: ILocationOrder = { id: 123 };
          expectedResult = service.addLocationOrderToCollectionIfMissing([], locationOrder);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(locationOrder);
        });

        it('should not add a LocationOrder to an array that contains it', () => {
          const locationOrder: ILocationOrder = { id: 123 };
          const locationOrderCollection: ILocationOrder[] = [
            {
              ...locationOrder,
            },
            { id: 456 },
          ];
          expectedResult = service.addLocationOrderToCollectionIfMissing(locationOrderCollection, locationOrder);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a LocationOrder to an array that doesn't contain it", () => {
          const locationOrder: ILocationOrder = { id: 123 };
          const locationOrderCollection: ILocationOrder[] = [{ id: 456 }];
          expectedResult = service.addLocationOrderToCollectionIfMissing(locationOrderCollection, locationOrder);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(locationOrder);
        });

        it('should add only unique LocationOrder to an array', () => {
          const locationOrderArray: ILocationOrder[] = [{ id: 123 }, { id: 456 }, { id: 94215 }];
          const locationOrderCollection: ILocationOrder[] = [{ id: 123 }];
          expectedResult = service.addLocationOrderToCollectionIfMissing(locationOrderCollection, ...locationOrderArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const locationOrder: ILocationOrder = { id: 123 };
          const locationOrder2: ILocationOrder = { id: 456 };
          expectedResult = service.addLocationOrderToCollectionIfMissing([], locationOrder, locationOrder2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(locationOrder);
          expect(expectedResult).toContain(locationOrder2);
        });

        it('should accept null and undefined values', () => {
          const locationOrder: ILocationOrder = { id: 123 };
          expectedResult = service.addLocationOrderToCollectionIfMissing([], null, locationOrder, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(locationOrder);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
