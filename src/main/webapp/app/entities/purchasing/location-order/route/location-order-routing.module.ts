import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LocationOrderComponent } from '../list/location-order.component';
import { LocationOrderDetailComponent } from '../detail/location-order-detail.component';
import { LocationOrderUpdateComponent } from '../update/location-order-update.component';
import { LocationOrderRoutingResolveService } from './location-order-routing-resolve.service';

const locationOrderRoute: Routes = [
  {
    path: '',
    component: LocationOrderComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LocationOrderDetailComponent,
    resolve: {
      locationOrder: LocationOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LocationOrderUpdateComponent,
    resolve: {
      locationOrder: LocationOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LocationOrderUpdateComponent,
    resolve: {
      locationOrder: LocationOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(locationOrderRoute)],
  exports: [RouterModule],
})
export class LocationOrderRoutingModule {}
