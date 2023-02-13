import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomResponse } from '../interface/custom-response';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Server } from '../interface/server';
import { Status } from '../enums/status.enum';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  private readonly apiUrl = 'http://localhost:8080';
  showModal = false;

  toggleAddServerModal() {
    this.showModal = !this.showModal;
  }

  servers$ = this.http.get<CustomResponse>(`${this.apiUrl}/server/list`).pipe(
    tap((response) => console.log(response)),
    catchError(this.handleError)
  );

  save$ = (server: Partial<Server>) =>
    this.http.post<CustomResponse>(`${this.apiUrl}/server/save`, server).pipe(
      tap((response) => console.log(response)),
      catchError(this.handleError)
    );

  ping$ = (ipAddress: string) =>
    this.http
      .get<CustomResponse>(`${this.apiUrl}/server/ping/${ipAddress}`)
      .pipe(
        tap((response) => console.log(response)),
        catchError(this.handleError)
      );

  filter$ = (status: Status, response: CustomResponse) =>
    new Observable<CustomResponse>((subscriber) => {
      console.log(response);

      subscriber.next(
        status === Status.ALL
          ? { ...response, message: `Servers filtered by ${status} status` }
          : {
              ...response,
              message:
                response.data.servers?.filter(
                  (server) => server.status === status
                ).length! > 0
                  ? `Servers filtered by ${
                      status === Status.SERVER_UP ? 'SERVER UP' : 'SERVER DOWN'
                    } status`
                  : `No servers found with ${status} status`,
              data: {
                servers: response.data.servers?.filter(
                  (server) => server.status === status
                ),
              },
            }
      );

      subscriber.complete();
    });

  delete$ = (id: string) =>
    this.http.delete<CustomResponse>(`${this.apiUrl}/server/delete/${id}`).pipe(
      tap((response) => console.log(response)),
      catchError(this.handleError)
    );

  constructor(private readonly http: HttpClient) {}

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(
      () => new Error(`An error has occured. Code: ${error.status}`)
    );
  }
}
