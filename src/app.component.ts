import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgWebConsoleComponent } from 'ng-web-console';
import { tap } from 'rxjs';
import { BehaviorSubjectService } from './service-with-a-subject/behaviour-subject.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, NgWebConsoleComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private behaviourSubjectService = inject(BehaviorSubjectService);

  // STEP 6: init observable using toSignal for use in the template
  items = toSignal(this.behaviourSubjectService.initItems$(), {initialValue: []});

  addItem() {
    this.behaviourSubjectService.createItem$();
  }

  updateItem() {
    this.behaviourSubjectService.updateItem$();
  }

  deleteItem() {
    this.behaviourSubjectService.deleteItem$();
  }
}
