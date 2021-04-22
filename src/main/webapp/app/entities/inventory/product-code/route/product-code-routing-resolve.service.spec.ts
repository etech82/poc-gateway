jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IProductCode, ProductCode } from '../product-code.model';
import { ProductCodeService } from '../service/product-code.service';

import { ProductCodeRoutingResolveService } from './product-code-routing-resolve.service';

describe('Service Tests', () => {
  describe('ProductCode routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ProductCodeRoutingResolveService;
    let service: ProductCodeService;
    let resultProductCode: IProductCode | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ProductCodeRoutingResolveService);
      service = TestBed.inject(ProductCodeService);
      resultProductCode = undefined;
    });

    describe('resolve', () => {
      it('should return IProductCode returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProductCode = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultProductCode).toEqual({ id: 123 });
      });

      it('should return new IProductCode if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProductCode = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultProductCode).toEqual(new ProductCode());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProductCode = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultProductCode).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
