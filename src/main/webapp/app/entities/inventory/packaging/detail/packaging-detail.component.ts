import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPackaging } from '../packaging.model';

@Component({
  selector: 'jhi-packaging-detail',
  templateUrl: './packaging-detail.component.html',
})
export class PackagingDetailComponent implements OnInit {
  packaging: IPackaging | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ packaging }) => {
      this.packaging = packaging;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
