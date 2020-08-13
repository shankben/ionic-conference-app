import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs-page';
import { SchedulePage } from '../schedule/schedule';


const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'schedule',
        children: [
          {
            path: '',
            component: SchedulePage,
          },
          {
            path: 'session/:sessionId',
            loadChildren: async () =>
              (await import('../session-detail/session-detail.module'))
              .SessionDetailModule
          }
        ]
      },
      {
        path: 'speakers',
        children: [
          {
            path: '',
            loadChildren: async () =>
              (await import('../speaker-list/speaker-list.module'))
              .SpeakerListModule
          },
          {
            path: 'session/:sessionId',
            loadChildren: async () =>
              (await import('../session-detail/session-detail.module'))
              .SessionDetailModule
          },
          {
            path: 'speaker-details/:speakerId',
            loadChildren: async () =>
              (await import('../speaker-detail/speaker-detail.module'))
              .SpeakerDetailModule
          }
        ]
      },
      {
        path: 'map',
        children: [
          {
            path: '',
            loadChildren: async () =>
              (await import('../map/map.module'))
              .MapModule
          }
        ]
      },
      {
        path: 'about',
        children: [
          {
            path: '',
            loadChildren: async () =>
              (await import('../about/about.module'))
              .AboutModule
          }
        ]
      },
      {
        path: '',
        redirectTo: '/app/tabs/schedule',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
