import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserEditComponent } from '@app/components/user-edit/user-edit.component';

const routes: Routes = [
  { path: '', component: UserEditComponent },
  { path: 'user-info', component: UserEditComponent },
  { path: '**', component: UserEditComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
