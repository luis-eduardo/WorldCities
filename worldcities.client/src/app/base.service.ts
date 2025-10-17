import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';

export abstract class BaseService<T> {
  protected constructor(
    protected http: HttpClient,
  ) { }

  abstract getData(paging: Paging): Observable<ApiResult<T>>;

  abstract get(id: number): Observable<T>;

  abstract put(item: T): Observable<T>;

  abstract post(item: T): Observable<T>;

  protected getUrl(url: string) {
    return environment.baseUrl + url;
  }

  protected setHttpParams(paging: Paging) {
    let httpParams: HttpParams = new HttpParams()
      .set("pageIndex", paging.pageIndex.toString())
      .set("pageSize", paging.pageSize.toString())
      .set("sortColumn", paging.sortColumn)
      .set("sortOrder", paging.sortOrder);

    if (paging.filterColumn && paging.filterQuery) {
      httpParams = httpParams
        .set("filterColumn", paging.filterColumn)
        .set("filterQuery", paging.filterQuery);
    }
    return httpParams;
  }
}

export interface ApiResult<T> {
  data: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  sortColumn: string;
  sortOrder: string;
  filterColumn: string;
  filterQuery: string;
}

export interface Paging {
  pageIndex: number;
  pageSize: number;
  sortColumn: string;
  sortOrder: string;
  filterColumn?: string | null;
  filterQuery?: string | null;
}
