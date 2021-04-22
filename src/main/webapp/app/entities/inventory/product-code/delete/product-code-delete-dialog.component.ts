import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProductCode } from '../product-code.model';
import { ProductCodeService } from '../service/product-code.service';

@Component({
  templateUrl: './product-code-delete-dialog.component.html',
})
export class ProductCodeDeleteDialogComponent {
  productCode?: IProductCode;

  constructor(protected productCodeService: ProductCodeService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.productCodeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
