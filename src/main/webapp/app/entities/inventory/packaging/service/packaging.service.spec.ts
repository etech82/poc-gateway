import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPackaging, Packaging } from '../packaging.model';

import { PackagingService } from './packaging.service';

describe('Service Tests', () => {
  describe('Packaging Service', () => {
    let service: PackagingService;
    let httpMock: HttpTestingController;
    let elemDefault: IPackaging;
    let expectedResult: IPackaging | IPackaging[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(PackagingService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
        quantity: 0,
        grosWeight: 0,
        netWeight: 0,
        length: 0,
        width: 0,
        height: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Packaging', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Packaging()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Packaging', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            quantity: 1,
            grosWeight: 1,
            netWeight: 1,
            length: 1,
            width: 1,
            height: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Packaging', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
            quantity: 1,
            netWeight: 1,
            height: 1,
          },
          new Packaging()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Packaging', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            quantity: 1,
            grosWeight: 1,
            netWeight: 1,
            length: 1,
            width: 1,
            height: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Packaging', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addPackagingToCollectionIfMissing', () => {
        it('should add a Packaging to an empty array', () => {
          const packaging: IPackaging = { id: 123 };
          expectedResult = service.addPackagingToCollectionIfMissing([], packaging);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(packaging);
        });

        it('should not add a Packaging to an array that contains it', () => {
          const packaging: IPackaging = { id: 123 };
          const packagingCollection: IPackaging[] = [
            {
              ...packaging,
            },
            { id: 456 },
          ];
          expectedResult = service.addPackagingToCollectionIfMissing(packagingCollection, packaging);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Packaging to an array that doesn't contain it", () => {
          const packaging: IPackaging = { id: 123 };
          const packagingCollection: IPackaging[] = [{ id: 456 }];
          expectedResult = service.addPackagingToCollectionIfMissing(packagingCollection, packaging);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(packaging);
        });

        it('should add only unique Packaging to an array', () => {
          const packagingArray: IPackaging[] = [{ id: 123 }, { id: 456 }, { id: 49923 }];
          const packagingCollection: IPackaging[] = [{ id: 123 }];
          expectedResult = service.addPackagingToCollectionIfMissing(packagingCollection, ...packagingArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const packaging: IPackaging = { id: 123 };
          const packaging2: IPackaging = { id: 456 };
          expectedResult = service.addPackagingToCollectionIfMissing([], packaging, packaging2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(packaging);
          expect(expectedResult).toContain(packaging2);
        });

        it('should accept null and undefined values', () => {
          const packaging: IPackaging = { id: 123 };
          expectedResult = service.addPackagingToCollectionIfMissing([], null, packaging, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(packaging);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
