import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { PackagingComponent } from './list/packaging.component';
import { PackagingDetailComponent } from './detail/packaging-detail.component';
import { PackagingUpdateComponent } from './update/packaging-update.component';
import { PackagingDeleteDialogComponent } from './delete/packaging-delete-dialog.component';
import { PackagingRoutingModule } from './route/packaging-routing.module';

@NgModule({
  imports: [SharedModule, PackagingRoutingModule],
  declarations: [PackagingComponent, PackagingDetailComponent, PackagingUpdateComponent, PackagingDeleteDialogComponent],
  entryComponents: [PackagingDeleteDialogComponent],
})
export class InventoryPackagingModule {}
