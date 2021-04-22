import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICatalog } from '../catalog.model';
import { CatalogService } from '../service/catalog.service';
import { CatalogDeleteDialogComponent } from '../delete/catalog-delete-dialog.component';

@Component({
  selector: 'jhi-catalog',
  templateUrl: './catalog.component.html',
})
export class CatalogComponent implements OnInit {
  catalogs?: ICatalog[];
  isLoading = false;

  constructor(protected catalogService: CatalogService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.catalogService.query().subscribe(
      (res: HttpResponse<ICatalog[]>) => {
        this.isLoading = false;
        this.catalogs = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICatalog): number {
    return item.id!;
  }

  delete(catalog: ICatalog): void {
    const modalRef = this.modalService.open(CatalogDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.catalog = catalog;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
