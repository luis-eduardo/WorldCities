import { Injectable } from '@angular/core';
import {ApiResult, BaseService, Paging} from '../base.service';
import {Country} from './country';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountryService
  extends BaseService<Country> {

  constructor(http: HttpClient) {
    super(http);
  }

  override getData(paging: Paging): Observable<ApiResult<Country>> {
      const url = this.getUrl("api/countries");
      const params = this.setHttpParams(paging);
      return this.http.get<ApiResult<Country>>(url, { params });
  }

  override get(id: number): Observable<Country> {
      const url = this.getUrl(`api/countries/${id}`);
      return this.http.get<Country>(url);
  }

  override put(item: Country): Observable<Country> {
      const url = this.getUrl(`api/countries/${item.id}`);
      return this.http.put<Country>(url, item);
  }

  override post(item: Country): Observable<Country> {
      const url = this.getUrl(`api/countries`);
      return this.http.post<Country>(url, item);
  }

  isDupeField(countryId: number, fieldName: string, fieldValue: string): Observable<boolean> {
    const url = this.getUrl("api/countries/isDupeField");
    const params = new HttpParams()
      .set("countryId", countryId)
      .set("fieldName", fieldName)
      .set("fieldValue", fieldValue);
    return this.http.post<boolean>(url, null, { params });
  }
}
