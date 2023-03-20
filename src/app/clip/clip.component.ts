import {
  Component,
  inject,
  ViewChild,
  ViewEncapsulation,
  type ElementRef,
  type OnInit,
  type OnDestroy,
} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import videojs from "video.js";

import type { Clip } from '../models/clip.model';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ClipComponent implements OnInit, OnDestroy {
  @ViewChild("videoPlayer", { static: true })
  videoElement?: ElementRef<HTMLVideoElement>;

  clip?: Clip;

  #player?: ReturnType<typeof videojs>;
  #route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.#player = videojs(this.videoElement!.nativeElement!, {
      aspectRation: "16:9",
    });
    this.#route.data.subscribe((data) => {
      this.clip = data["clip"] as Clip;
      this.#player?.src({ type: "video/mp4", src: this.clip?.url });
    });
  }

  ngOnDestroy(): void {
    if (this.#player) {
      this.#player.dispose();
    }
  }
}
