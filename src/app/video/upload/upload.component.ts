import { Component, inject, type OnInit, type OnDestroy } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  fromTask,
  type UploadTask,
} from "@angular/fire/storage";
import { Timestamp } from "@angular/fire/firestore";
import { Auth, type User } from "@angular/fire/auth";
import { combineLatest, map } from "rxjs";
import { FfmpegService } from "../../services/ffmpeg.service";

import { ClipService } from "../../services/clip.service";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit, OnDestroy {
  isDragOver = false;
  nextStep = false;
  showAlert = false;
  alertColor = "blue";
  alertMessage = "Please wait! Your clips is being uploaded.";
  inSubmission = false;
  percentage = 0;
  showPercentage = false;
  screenshots: Array<string> = [];
  selectedScreenshot = "";

  uploadForm = new FormGroup({
    title: new FormControl("", {
      validators: [Validators.required, Validators.minLength(3)],
      nonNullable: true,
    })
  });

  #title = inject(Title);
  #storage = inject(Storage);
  #auth = inject(Auth);
  #router = inject(Router);
  #clipService = inject(ClipService);
  #ffmpeg = inject(FfmpegService);
  #file: File | null = null;
  #user: User | null = null;
  #clipTask?: UploadTask;
  #screenshotTask?: UploadTask;

  get isFFmpegReady() {
    return this.#ffmpeg.isReady;
  }

  get isFFmpegRunning() {
    return this.#ffmpeg.isRunning;
  }

  constructor() {
    this.#ffmpeg.init()
      .catch((err) => console.error(err));
  }

  ngOnInit(): void {
    this.#title.setTitle("Upload Video - Clipz");
    this.#auth.onAuthStateChanged((user) => {
      this.#user = user;
    });
  }

  ngOnDestroy(): void {
    this.#clipTask?.cancel();
  }

  async storeFile(event: Event): Promise<void> {
    if (this.isFFmpegRunning) {
      return;
    }

    this.isDragOver = false;
    this.#file = (event instanceof DragEvent) && event.dataTransfer
      ? event.dataTransfer?.files?.item(0) ?? null
      : (event.target as HTMLInputElement).files?.item(0) ?? null;

    if (this.#file === null || this.#file.type !== "video/mp4") {
      return;
    }

    this.screenshots = await this.#ffmpeg.getScreenshots(this.#file);
    this.selectedScreenshot = this.screenshots[0];
    this.uploadForm.setValue({
      title: this.#file.name.replace(/\.[^/.]+$/, "")
    });
    this.nextStep = true;
  }

  async uploadFile(): Promise<void> {
    if (this.#file !== null) {
      this.uploadForm.disable();

      this.showAlert = true;
      this.alertColor = "blue";
      this.alertMessage = "Please wait! Your clips is being uploaded.";
      this.inSubmission = true;
      this.showPercentage = true;

      const filename = `${crypto.randomUUID()}_${this.#file.name}`;
      const clipRef = ref(this.#storage, `clipz/${filename}`);
      this.#clipTask = uploadBytesResumable(clipRef, this.#file);

      const screenshotBlob = await this.#ffmpeg.blobFromUrl(this.selectedScreenshot);
      const screenshotRef = ref(this.#storage, `screenshots/${filename}`);
      this.#screenshotTask = uploadBytesResumable(screenshotRef, screenshotBlob);

      combineLatest([fromTask(this.#clipTask), fromTask(this.#screenshotTask)])
        .pipe(
          map(([clipSnapshot, screenshotSnapshot]) => {
            const totalBytesTransferred = clipSnapshot.bytesTransferred + screenshotSnapshot.bytesTransferred;
            const grandTotalBytes = clipSnapshot.totalBytes + screenshotSnapshot.totalBytes;

            return [totalBytesTransferred, grandTotalBytes];
          }),
        )
        .subscribe({
          next: ([totalBytesTransferred, grandTotalBytes]) => {
            this.percentage = totalBytesTransferred / grandTotalBytes;
          },
          error: (error) => {
            this.uploadForm.enable();

            this.alertColor = "red";
            this.alertMessage = "Upload failed! Please try again later.";
            this.showPercentage = false;
            this.inSubmission = false;
            console.error(error);
          },
          complete: () => {
            this.alertColor = "green";
            this.alertMessage = "Success! Your clip is now ready to share with the world.";
            this.showPercentage = false;

            Promise.all([
              getDownloadURL(this.#clipTask!.snapshot.ref),
              getDownloadURL(this.#screenshotTask!.snapshot.ref),
            ]).then(([clipUrl, screenshotUrl]) => {
              return {
                uid: this.#user!.uid,
                displayName: this.#user!.displayName!,
                title: this.uploadForm.controls.title.value,
                timestamp: Timestamp.now(),
                filename,
                url: clipUrl,
                screenshotName: `${filename}.png`,
                screenshotUrl,
              };
            }).then((clip) => {
              return this.#clipService.createClip(clip);
            }).then((docRef) => {
              return new Promise<typeof docRef>((resolve) => {
                setTimeout(() => resolve(docRef), 1000);
              });
            }).then((docRef) => {
              return this.#router.navigate(["clip", docRef.id]);
            });
          },
        });
    }
  }
}
