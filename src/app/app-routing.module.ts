import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserEditComponent } from '@app/components/user-edit/user-edit.component';
import { ArtistListComponent } from '@app/components/artist-list/artist-list.component';
import { AlbumListComponent } from '@app/components/album-list/album-list.component';
import { HomeComponent } from '@app/components/home/home.component';
import { ArtistDetailComponent } from '@app/components/artist-detail/artist-detail.component';
import { AlbumDetailComponent } from '@app/components/album-detail/album-detail.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'artist-list', component: ArtistListComponent },
  { path: 'album-list', component: AlbumListComponent },
  { path: 'user-info', component: UserEditComponent },
  { path: 'artist/:id', component: ArtistDetailComponent },
  { path: 'album/:id', component: AlbumDetailComponent },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
