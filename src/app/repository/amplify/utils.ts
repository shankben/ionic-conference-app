import API, {
  GraphQLResult,
  graphqlOperation,
  GRAPHQL_AUTH_MODE
} from '@aws-amplify/api';
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

interface AppSyncResponse {
  provider: any;
  value: any;
}

interface ObservableFromSubscriptionResponse<T> {
  observable: Observable<T>;
  subscription: Unsubscribable;
}

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
  return map((item: KeyIdLike) => oneKeyToId(item));
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

export function subscribe<T>(
  op: any,
  authMode = GRAPHQL_AUTH_MODE.AWS_IAM
): ObservableFromSubscriptionResponse<T> {
  const listener = API.graphql({
    ...graphqlOperation(op),
    authMode
  }) as ZenObservable<object>;
  let subscription: Unsubscribable;
  const observable = Observable.create((observer: Observer<T>) => {
    subscription = listener.subscribe((res: AppSyncResponse) =>
      observer.next(res.value.data[firstKey(res.value.data)] as T)
    );
  });
  return {
    observable,
    subscription
  };
}

export async function performGraphqlOperation<T extends object>(
  op: any,
  args: any = {},
  authMode = GRAPHQL_AUTH_MODE.AWS_IAM
): Promise<T> {
  const res = await API.graphql({
    ...graphqlOperation(op, args),
    authMode
  }) as GraphQLResult<T>;
  if ('errors' in res) {
    throw new Error(JSON.stringify(res.errors));
  }
  return res.data[firstKey(res.data)] as T;
}
