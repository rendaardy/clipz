import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { provideFirebaseApp, initializeApp } from "@angular/fire/app";
import { provideFirestore, getFirestore } from "@angular/fire/firestore";
import { provideAuth, getAuth } from "@angular/fire/auth";
import { provideStorage, getStorage } from "@angular/fire/storage";

import { AppRoutingModule } from "./app-routing.module";
import { UserModule } from "./user/user.module";

import { AppComponent } from "./app.component";
import { NavComponent } from "./nav/nav.component";
import { HomeComponent } from "./home/home.component";
import { ClipComponent } from "./clip/clip.component";
import { AboutComponent } from "./about/about.component";
import { NotFoundComponent } from "./not-found/not-found.component";

import { environment } from "../environments/environment";
import { ClipsListComponent } from './clips-list/clips-list.component';
import { FireTimestampPipe } from './pipes/fire-timestamp.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    ClipComponent,
    AboutComponent,
    NotFoundComponent,
    ClipsListComponent,
    FireTimestampPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UserModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
