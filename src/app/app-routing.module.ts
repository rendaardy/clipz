import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { AuthGuard, redirectUnauthorizedTo } from "@angular/fire/auth-guard";

import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { ClipComponent } from "./clip/clip.component";
import { NotFoundComponent } from "./not-found/not-found.component";

import { ClipResolver } from "./clip/clip.resolver";

const redirectUnauthorizedToHome = () => redirectUnauthorizedTo("/");

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "about",
    component: AboutComponent,
  },
  {
    path: "clip/:id",
    component: ClipComponent,
    resolve: {
      clip: ClipResolver,
    },
  },
  {
    path: "video",
    loadChildren: () => import("./video/video.module").then((m) => m.VideoModule),
    data: {
      authOnly: true,
      authGuardPipe: redirectUnauthorizedToHome,
    },
    canActivate: [AuthGuard],
  },
  {
    path: "**",
    component: NotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
