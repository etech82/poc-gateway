import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ProductCodeComponent } from './list/product-code.component';
import { ProductCodeDetailComponent } from './detail/product-code-detail.component';
import { ProductCodeUpdateComponent } from './update/product-code-update.component';
import { ProductCodeDeleteDialogComponent } from './delete/product-code-delete-dialog.component';
import { ProductCodeRoutingModule } from './route/product-code-routing.module';

@NgModule({
  imports: [SharedModule, ProductCodeRoutingModule],
  declarations: [ProductCodeComponent, ProductCodeDetailComponent, ProductCodeUpdateComponent, ProductCodeDeleteDialogComponent],
  entryComponents: [ProductCodeDeleteDialogComponent],
})
export class InventoryProductCodeModule {}
