jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPackaging, Packaging } from '../packaging.model';
import { PackagingService } from '../service/packaging.service';

import { PackagingRoutingResolveService } from './packaging-routing-resolve.service';

describe('Service Tests', () => {
  describe('Packaging routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: PackagingRoutingResolveService;
    let service: PackagingService;
    let resultPackaging: IPackaging | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(PackagingRoutingResolveService);
      service = TestBed.inject(PackagingService);
      resultPackaging = undefined;
    });

    describe('resolve', () => {
      it('should return IPackaging returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPackaging = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPackaging).toEqual({ id: 123 });
      });

      it('should return new IPackaging if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPackaging = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultPackaging).toEqual(new Packaging());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPackaging = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPackaging).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
