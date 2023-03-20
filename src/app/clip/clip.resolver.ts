import { Injectable, inject } from '@angular/core';
import {
  Router,
  type Resolve,
  type RouterStateSnapshot,
  type ActivatedRouteSnapshot
} from '@angular/router';
import { Firestore, collection, docData, doc } from "@angular/fire/firestore";
import { map, type Observable } from 'rxjs';

import { clipConverter } from "../services/clip.service";

import type { Clip } from "../models/clip.model";

@Injectable({
  providedIn: 'root'
})
export class ClipResolver implements Resolve<Clip | null> {
  #router = inject(Router);
  #firestore = inject(Firestore);

  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<Clip | null> {
    const ref = collection(this.#firestore, "clips").withConverter(clipConverter);
    const docRef = doc(ref, route.paramMap.get("id")!);

    return docData(docRef).pipe(
      map((clip) => {
        if (!clip) {
          this.#router.navigate(["/"]);
          return null;
        }

        return clip;
      }),
    );
  }
}
