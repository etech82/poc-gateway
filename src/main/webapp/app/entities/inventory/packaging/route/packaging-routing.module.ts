import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PackagingComponent } from '../list/packaging.component';
import { PackagingDetailComponent } from '../detail/packaging-detail.component';
import { PackagingUpdateComponent } from '../update/packaging-update.component';
import { PackagingRoutingResolveService } from './packaging-routing-resolve.service';

const packagingRoute: Routes = [
  {
    path: '',
    component: PackagingComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PackagingDetailComponent,
    resolve: {
      packaging: PackagingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PackagingUpdateComponent,
    resolve: {
      packaging: PackagingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PackagingUpdateComponent,
    resolve: {
      packaging: PackagingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(packagingRoute)],
  exports: [RouterModule],
})
export class PackagingRoutingModule {}
