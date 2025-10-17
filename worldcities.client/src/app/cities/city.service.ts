import {Injectable} from '@angular/core';
import {ApiResult, BaseService, Paging} from '../base.service';
import {City} from './city';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Country} from '../countries/country';

@Injectable({
  providedIn: 'root'
})
export class CityService
  extends BaseService<City> {

  constructor(http: HttpClient) {
    super(http);
  }

  override getData(paging: Paging): Observable<ApiResult<City>> {
    const url = this.getUrl("api/cities");
    const params = this.setHttpParams(paging);
    return this.http.get<ApiResult<City>>(url, { params });
  }

  override get(id: number): Observable<City> {
    const url = this.getUrl(`api/cities/${id}`);
    return this.http.get<City>(url);
  }

  override put(item: City): Observable<City> {
    const url = this.getUrl(`api/cities/${item.id}`);
    return this.http.put<City>(url, item);
  }

  override post(item: City): Observable<City> {
    const url = this.getUrl("api/cities/");
    return this.http.post<City>(url, item);
  }

  getCountries(paging: Paging): Observable<ApiResult<Country>> {
    const url = this.getUrl('api/countries/');
    const params = this.setHttpParams(paging);

    return this.http.get<ApiResult<Country>>(url, { params });
  }

  isDupeCity(item: City): Observable<boolean> {
    const url = this.getUrl("api/cities/isDupeCity");
    return this.http.post<boolean>(url, item);
  }
}
