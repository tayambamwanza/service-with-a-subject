import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap, take, tap } from 'rxjs';
import { Item } from './item.interface';

import { randFullName, randNumber, randBoolean, randUuid } from '@ngneat/falso';

@Injectable({ providedIn: 'root' })
export class BehaviorSubjectService {
  // STEP 1: Create Behaviour Subject
  #items = new BehaviorSubject<Item[]>([]);

  // STEP 2: Derive Observable from Subject
  #items$ = this.#items.asObservable();

  // STEP 3: Fetch data from api and set Subject Value to the result.
  fetchItems$() {
    return of(this.generateFalsoUsers()).pipe(
      tap((items) => this.#items.next(items))
    );
  }

  // STEP 4: Function to get Observable
  getItems$(): Observable<Item[]> {
    return this.#items$;
  }

  // STEP 5: Function fetch data from api and then get Observable
  initItems$() {
    return this.fetchItems$().pipe(
      switchMap(() => {
        return this.getItems$();
      })
    );
  }

  // STEP 6 continues in the component

  setItems(items: Item[]) {
    this.#items.next(items);
  }

  clearItems() {
    this.#items.next([]);
  }

  createItem$(item?: Item) {
    // not implemented in this demo
    return of(this.generateFalsoItem())
      .pipe(switchMap((falsoItem) => this.addItem$(falsoItem)))
      .subscribe();
  }

  /** Add item to local array */
  private addItem$(item: Item) {
    return this.getItems$().pipe(
      take(1),
      tap((items) => {
        const newItems = [item, ...items];
        this.setItems(newItems);
      })
    );
  }

  updateItem$(item?: Item) {
    // not implemented in this demo
    return of(this.generateFalsoItem())
      .pipe(switchMap((falsoItem) => this.editItem$(falsoItem)))
      .subscribe();
  }

  /** Update item in local array */
  private editItem$(updatedItem: Item) {
    return this.getItems$().pipe(
      take(1),
      tap((items) => {
        // Checks for item by ID, disabled for demo.
        // const updatedItemIndex = items.findIndex(item => item.id === updatedItem.id);
        const updatedItemIndex = 0;
        const updatedItems = items;
        updatedItems[updatedItemIndex] = updatedItem;
        this.setItems(updatedItems);
      })
    );
  }

  deleteItem$(item?: Item) {
    // not implemented in this demo
    return of(this.generateFalsoItem())
      .pipe(switchMap((falsoItem) => this.removeItem$(falsoItem)))
      .subscribe();
  }

  /** Delete item from local array */
  private removeItem$(deletedItem: Item) {
    return this.getItems$().pipe(
      take(1),
      tap((items) => {
        // Checks for item by ID, disabled for demo.
        // const remainingItems = items.filter(item => item.id === deletedItem.id);
        const remainingItems = items;
        remainingItems.splice(0, 1);
        this.setItems(remainingItems);
      })
    );
  }

  // Create Fake User
  generateFalsoItem() {
    return {
      id: randUuid(),
      fullName: randFullName(),
      age: randNumber(),
      isNerdy: randBoolean(),
    };
  }

  // Create Fake Users Array
  generateFalsoUsers() {
    return new Array(10).fill(null).map(this.generateFalsoItem);
  }
}
