import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  type FirestoreDataConverter,
  type DocumentReference,
  type QueryDocumentSnapshot,
} from "@angular/fire/firestore";
import { Storage, ref, deleteObject } from "@angular/fire/storage";
import { Auth } from "@angular/fire/auth";
import { ReplaySubject, type Observable } from "rxjs";

import type { Clip } from "../models/clip.model";

export const clipConverter: FirestoreDataConverter<Clip> = {
  toFirestore(clip) {
    return {
      uid: clip.uid,
      title: clip.title,
      filename: clip.filename,
      displayName: clip.displayName,
      timestamp: clip.timestamp,
      url: clip.url,
      screenshotUrl: clip.screenshotUrl,
      screenshotName: clip.screenshotName,
    };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      docId: snapshot.id,
      uid: data['uid'],
      title: data['title'],
      filename: data['filename'],
      displayName: data['displayName'],
      timestamp: data['timestamp'],
      url: data['url'],
      screenshotUrl: data["screenshotUrl"],
      screenshotName: data["screenshotName"],
    };
  }
};

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  #db = inject(Firestore);
  #auth = inject(Auth);
  #storage = inject(Storage);
  #collectionRef = collection(this.#db, "clips").withConverter(clipConverter);
  #lastVisible: QueryDocumentSnapshot | null = null;
  #lastClip = false;
  #pendingRequest = false;

  #clip = new ReplaySubject<Clip>();

  get clip(): Observable<Clip> {
    return this.#clip.asObservable();
  }

  async createClip(clip: Clip): Promise<DocumentReference<Clip>> {
    return addDoc(this.#collectionRef, clip);
  }

  async fetchClips(): Promise<void> {
    if (this.#pendingRequest || this.#lastClip) {
      return;
    }

    this.#pendingRequest = true;

    try {
      const getQuery = this.#lastVisible !== null
        ? query(
            this.#collectionRef,
            orderBy("timestamp", "desc"),
            startAfter(this.#lastVisible),
            limit(6),
          )
        : query(this.#collectionRef, orderBy("timestamp", "desc"), limit(6));

      const snapshot = await getDocs(getQuery);

      for (const doc of snapshot.docs) {
        this.#clip.next(doc.data());
      }

      this.#lastVisible = snapshot.docs.at(-1) ?? null;
      if (this.#lastVisible === null) {
        this.#lastClip = true;
        this.#clip.complete();
      }
    } catch(error) {
      throw new Error("Failed to fetch clips", { cause: error });
    } finally {
      this.#pendingRequest = false;
    }
  }

  async getUserClips(videoSort = "desc"): Promise<Array<Clip>> {
    const user = this.#auth.currentUser;

    if (user === null) {
      return [];
    }

    const clipQuery = query(
      this.#collectionRef,
      where("uid", "==", user.uid),
      orderBy("timestamp", videoSort === "desc" ? "desc" : "asc"),
    );
    const querySnapshot = await getDocs(clipQuery);

    return querySnapshot.docs.map((snapshot) => {
      return snapshot.data();
    })
  }

  async updateClip(id: string, title: string): Promise<void> {
    const clipRef = doc(this.#collectionRef, id);
    await updateDoc(clipRef, { title });
  }

  async deleteClip(id: string, filename: string, screenshotName: string): Promise<void> {
    const clipRef = doc(this.#collectionRef, id);
    const fileRef = ref(this.#storage, `clipz/${filename}`);
    const screenshotRef = ref(this.#storage, `screenshots/${screenshotName}`);

    await Promise.allSettled([
      deleteObject(fileRef),
      deleteObject(screenshotRef),
      deleteDoc(clipRef),
    ]);
  }
}
