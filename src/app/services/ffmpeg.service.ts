import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile, type FFmpeg } from "@ffmpeg/ffmpeg";

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {
  #ffmpeg: FFmpeg;
  #isReady = false;
  #isRunning = false;

  get isReady() {
    return this.#isReady;
  }

  get isRunning() {
    return this.#isRunning;
  }

  constructor() {
    this.#ffmpeg = createFFmpeg({ log: true });
  }

  async init(): Promise<void> {
    if (this.#isReady) {
      return;
    }

    await this.#ffmpeg.load();
    this.#isReady = true;
  }

  async getScreenshots(file: File): Promise<Array<string>> {
    this.#isRunning = true;

    const data = await fetchFile(file);

    this.#ffmpeg.FS("writeFile", file.name, data);

    const seconds = [1, 3, 5];
    const commands = seconds.flatMap((second) => [
      "-i", file.name,
      "-ss", `00:00:0${second}`,
      "-frames:v", "1",
      "-filter:v", "scale=510:-1",
      `output_0${second}.png`,
    ]);

    await this.#ffmpeg.run(...commands);

    this.#isRunning = false;

    return seconds.map((second) => {
      const file = this.#ffmpeg.FS("readFile", `output_0${second}.png`);
      const blob = new Blob([file.buffer], { type: "image/png" });

      return URL.createObjectURL(blob);
    });
  }

  async blobFromUrl(url: string): Promise<Blob> {
    const response = await fetch(url);
    const blob = await response.blob();

    return blob;
  }
}
