import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SingUpFormComponent } from './components/sing-up-form/sing-up-form.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { AlbumListComponent } from './components/album-list/album-list.component';
import { ArtistListComponent } from './components/artist-list/artist-list.component';
import { HomeComponent } from './components/home/home.component';
import { ArtistModalComponent } from './components/common/artist-modal/artist-modal.component';
import { ArtistItemComponent } from './components/common/artist-item/artist-item.component';
import { PaginationBarComponent } from './components/common/pagination-bar/pagination-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    SingUpFormComponent,
    UserEditComponent,
    AlbumListComponent,
    ArtistListComponent,
    HomeComponent,
    ArtistModalComponent,
    ArtistItemComponent,
    PaginationBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDialogModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    ArtistModalComponent,
  ]
})
export class AppModule { }
