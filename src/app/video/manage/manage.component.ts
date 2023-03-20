import { Component, inject, type OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { ClipService } from "../../services/clip.service";
import { ModalService } from "../../services/modal.service";

import type { Clip } from "../../models/clip.model";

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #clipService = inject(ClipService);
  #modalService = inject(ModalService);

  videoSort = "desc";
  clips: Array<Clip> = [];
  activeClip: Clip | null = null;

  ngOnInit(): void {
    this.#route.queryParamMap.subscribe((queryParam) => {
      this.videoSort = queryParam.get("sort") ?? "desc";
      this.#clipService.getUserClips(this.videoSort)
        .then((clips) => this.clips = clips);
    });
  }

  async sort(event: Event): Promise<void> {
    const { value } = (event.target as HTMLSelectElement);
    await this.#router.navigate([], {
      relativeTo: this.#route,
      queryParams: {
        sort: value,
      }
    });
  }

  openEditModal(event: Event, clip: Clip): void {
    event.preventDefault();

    this.activeClip = clip;
    this.#modalService.toggle("editClip");
  }

  async deleteClip(event: Event, clip: Clip): Promise<void> {
    event.preventDefault();

    await this.#clipService.deleteClip(clip.docId!, clip.filename, clip.screenshotName);

    for (const [i, c] of Object.entries(this.clips)) {
      if (c.docId === clip.docId) {
        this.clips.splice(Number(i), 1);
        break;
      }
    }
  }

  update(updatedClip: Clip): void {
    for (const clip of this.clips) {
      if (clip.docId === updatedClip.docId) {
        clip.title = updatedClip.title;
        break;
      }
    }
  }
}
