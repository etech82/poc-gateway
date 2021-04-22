import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProductCode, ProductCode } from '../product-code.model';

import { ProductCodeService } from './product-code.service';

describe('Service Tests', () => {
  describe('ProductCode Service', () => {
    let service: ProductCodeService;
    let httpMock: HttpTestingController;
    let elemDefault: IProductCode;
    let expectedResult: IProductCode | IProductCode[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ProductCodeService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        upc: 'AAAAAAA',
        barcode: 'AAAAAAA',
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

      it('should create a ProductCode', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new ProductCode()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ProductCode', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            upc: 'BBBBBB',
            barcode: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a ProductCode', () => {
        const patchObject = Object.assign({}, new ProductCode());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ProductCode', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            upc: 'BBBBBB',
            barcode: 'BBBBBB',
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

      it('should delete a ProductCode', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addProductCodeToCollectionIfMissing', () => {
        it('should add a ProductCode to an empty array', () => {
          const productCode: IProductCode = { id: 123 };
          expectedResult = service.addProductCodeToCollectionIfMissing([], productCode);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(productCode);
        });

        it('should not add a ProductCode to an array that contains it', () => {
          const productCode: IProductCode = { id: 123 };
          const productCodeCollection: IProductCode[] = [
            {
              ...productCode,
            },
            { id: 456 },
          ];
          expectedResult = service.addProductCodeToCollectionIfMissing(productCodeCollection, productCode);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a ProductCode to an array that doesn't contain it", () => {
          const productCode: IProductCode = { id: 123 };
          const productCodeCollection: IProductCode[] = [{ id: 456 }];
          expectedResult = service.addProductCodeToCollectionIfMissing(productCodeCollection, productCode);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(productCode);
        });

        it('should add only unique ProductCode to an array', () => {
          const productCodeArray: IProductCode[] = [{ id: 123 }, { id: 456 }, { id: 82252 }];
          const productCodeCollection: IProductCode[] = [{ id: 123 }];
          expectedResult = service.addProductCodeToCollectionIfMissing(productCodeCollection, ...productCodeArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const productCode: IProductCode = { id: 123 };
          const productCode2: IProductCode = { id: 456 };
          expectedResult = service.addProductCodeToCollectionIfMissing([], productCode, productCode2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(productCode);
          expect(expectedResult).toContain(productCode2);
        });

        it('should accept null and undefined values', () => {
          const productCode: IProductCode = { id: 123 };
          expectedResult = service.addProductCodeToCollectionIfMissing([], null, productCode, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(productCode);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
