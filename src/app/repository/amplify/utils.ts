import { Observable as ZenObservable } from 'zen-observable-ts';

import {
  Observer,
  Observable,
  OperatorFunction
} from 'rxjs';
import { map } from 'rxjs/operators';

import {
  KeyIdLike,
  NameLike,
  Unsubscribable
} from '../../models';

export const firstKey = (obj: {[k: string]: any}): string =>
  Object.keys(obj).shift() ?? '';

export function oneKeyToId<T>(item: KeyIdLike): T {
  item.id = item.key;
  return (item as unknown) as T;
}

export function keysToIds<T>(): OperatorFunction<KeyIdLike[], T[]> {
  return map((items: KeyIdLike[]) =>
    items.map((it: KeyIdLike) => oneKeyToId<T>(it)));
}

export function keyToId<T>(): OperatorFunction<KeyIdLike, T> {
  return map((item: KeyIdLike) => this.oneKeyToId(item));
}

export function sortByName<T>(): OperatorFunction<NameLike[], T[]> {
  return map((items: NameLike[]) =>
    (items.sort((x, y) => x.name <= y.name ? -1 : 1) as unknown[]) as T[]);
}

export async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const fr = new FileReader();
      fr.onload = (ev) => resolve(ev.target.result as string);
      fr.readAsDataURL(blob);
    } catch (err) {
      reject(err);
    }
  });
}

export function observableFromSubscription<T, U>(listener: ZenObservable<T>) {
  let subscription: Unsubscribable;
  const observable = Observable.create((observer: Observer<U[]>) => {
    subscription = listener.subscribe((res: any) => observer.next([
      res.value.data[firstKey(res.value.data)] as U
    ]));
  });
  return {
    observable,
    subscription
  };
}
