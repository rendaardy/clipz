import { Component, inject, Input, type OnInit, type OnDestroy } from '@angular/core';
import {
  switchMap,
  from,
  fromEvent,
  type Subscription,
} from "rxjs";

import { ClipService } from "../services/clip.service";

import type { Clip } from "../models/clip.model";

@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrls: ['./clips-list.component.css'],
  providers: [ClipService],
})
export class ClipsListComponent implements OnInit, OnDestroy {
  @Input()
  scrollable = true;

  clips: Array<Clip> = [];

  #clipService = inject(ClipService);
  #clipSubscription: Subscription | null = null;
  #scrollEventSubscription: Subscription | null = null;

  ngOnInit(): void {
    if (this.scrollable) {
      this.#scrollEventSubscription = fromEvent(window, "scroll")
        .subscribe(() => this.#handleScroll());
    }

    this.#clipSubscription = from(this.#clipService.fetchClips())
      .pipe(
        switchMap(() => this.#clipService.clip),
      )
      .subscribe((clip) => this.clips = [...this.clips, clip]);
  }

  ngOnDestroy(): void {
    this.#scrollEventSubscription?.unsubscribe();
    this.#clipSubscription?.unsubscribe();
    this.clips = [];
  }

  async #handleScroll(): Promise<void> {
    const { scrollTop, offsetHeight } = document.documentElement;
    const { innerHeight } = window;

    const bottomOfWindow = Math.round(scrollTop) + innerHeight >= offsetHeight;

    if (bottomOfWindow) {
      console.log("about to fetch next clips");
      await this.#clipService.fetchClips();
    }
  }
}
