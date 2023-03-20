import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "@angular/fire/auth";
import { Firestore, doc, setDoc, type DocumentReference } from "@angular/fire/firestore";
import { filter, map, of, switchMap } from "rxjs";

import type { User } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #auth = inject(Auth);
  #firestore = inject(Firestore);
  #isAuthenticated = false;
  #shouldRedirect = false;

  get isAuthenticated(): boolean {
    return this.#isAuthenticated;
  }

  constructor() {
    this.#auth.onAuthStateChanged((user) => {
      this.#isAuthenticated = (user !== null);
    });

    this.#router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.#route.firstChild),
      switchMap((route) => route?.data ?? of({})),
    ).subscribe((data) => {
      this.#shouldRedirect = data?.['authOnly'] ?? false;
    });
  }

  async createUser(userData: User): Promise<void> {
    const userCredential = await createUserWithEmailAndPassword(
      this.#auth,
      userData.email,
      userData.password,
    );

    const docRef = doc(this.#firestore, `users/${userCredential.user.uid}`) as DocumentReference<Omit<User, "password">>;

    await setDoc(docRef, {
      name: userData.name,
      age: userData.age,
      email: userData.email,
      phoneNumber: userData.email,
    });
  }

  async signin(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.#auth, email, password);
  }

  async signout(): Promise<void> {
    await signOut(this.#auth);

    if (this.#shouldRedirect) {
      await this.#router.navigateByUrl("/");
    }
  }
}
