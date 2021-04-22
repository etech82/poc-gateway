import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPackaging } from '../packaging.model';
import { PackagingService } from '../service/packaging.service';
import { PackagingDeleteDialogComponent } from '../delete/packaging-delete-dialog.component';

@Component({
  selector: 'jhi-packaging',
  templateUrl: './packaging.component.html',
})
export class PackagingComponent implements OnInit {
  packagings?: IPackaging[];
  isLoading = false;

  constructor(protected packagingService: PackagingService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.packagingService.query().subscribe(
      (res: HttpResponse<IPackaging[]>) => {
        this.isLoading = false;
        this.packagings = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPackaging): number {
    return item.id!;
  }

  delete(packaging: IPackaging): void {
    const modalRef = this.modalService.open(PackagingDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.packaging = packaging;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
