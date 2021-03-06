import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { NotificationService } from '../service/notification.service';

import { NotificationComponent } from './notification.component';

describe('Component Tests', () => {
  describe('Notification Management Component', () => {
    let comp: NotificationComponent;
    let fixture: ComponentFixture<NotificationComponent>;
    let service: NotificationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [NotificationComponent],
      })
        .overrideTemplate(NotificationComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(NotificationComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(NotificationService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.notifications?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
