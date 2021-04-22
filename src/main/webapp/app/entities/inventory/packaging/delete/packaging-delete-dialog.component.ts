import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPackaging } from '../packaging.model';
import { PackagingService } from '../service/packaging.service';

@Component({
  templateUrl: './packaging-delete-dialog.component.html',
})
export class PackagingDeleteDialogComponent {
  packaging?: IPackaging;

  constructor(protected packagingService: PackagingService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.packagingService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
