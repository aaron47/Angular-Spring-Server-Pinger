import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
  tap,
} from 'rxjs';
import { ServerService } from './service/server.service';
import { Component, OnInit } from '@angular/core';
import { AppState } from './interface/app.state';
import { CustomResponse } from './interface/custom-response';
import { DataState } from './enums/data-state.enum';
import { Status } from './enums/status.enum';
import { ServerFormValues } from './utils/serverFormValues.type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  appState$!: Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  readonly Status = Status;
  private filterSubject = new BehaviorSubject<string>('');
  private dataSubject = new BehaviorSubject<CustomResponse | null>(null);
  filterAction$ = this.filterSubject.asObservable();

  constructor(protected readonly serverService: ServerService) {}

  ngOnInit(): void {
    this.appState$ = this.serverService.servers$.pipe(
      map((res) => {
        this.dataSubject.next(res);

        return {
          dataState: DataState.LOADED_STATE,
          appData: res,
          error: undefined,
        };
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
  }

  addServer(server: ServerFormValues) {
    this.appState$ = this.serverService.save$(server).pipe(
      map((res) => {
        this.dataSubject.value!.data.servers!.push(res.data.server!);

        this.filterSubject.next('');

        this.serverService.toggleAddServerModal();
        return {
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value!,
        };
      }),

      startWith({
        dataState: DataState.LOADED_STATE,
        appData: this.dataSubject.value!,
      }),

      catchError((error: string) => {
        this.filterSubject.next('');
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
  }

  pingServer(ipAddress: string) {
    this.filterSubject.next(ipAddress);

    this.appState$ = this.serverService.ping$(ipAddress).pipe(
      map((res) => {
        const pingedServerIndex =
          this.dataSubject.value?.data.servers!.findIndex(
            (server) => server.id === res.data.server!.id!
          );

        this.dataSubject.value!.data.servers![pingedServerIndex!] =
          res.data!.server!;

        this.filterSubject.next('');

        return {
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value!,
        };
      }),

      startWith({
        dataState: DataState.LOADED_STATE,
        appData: this.dataSubject.value!,
      }),

      catchError((error: string) => {
        this.filterSubject.next('');
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
  }

  filterServers(status: Status) {
    console.log(status);

    this.appState$ = this.serverService
      .filter$(status, this.dataSubject.value!)
      .pipe(
        map((res) => {
          this.filterSubject.next('');
          return {
            dataState: DataState.LOADED_STATE,
            appData: res,
          };
        }),

        startWith({
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value!,
        }),

        catchError((error: string) => {
          this.filterSubject.next('');
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      );
  }

  openModal() {
    this.serverService.toggleAddServerModal();
  }
}
