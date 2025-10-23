import { Injectable } from '@angular/core';
import { ApiResult, BaseService, Paging } from '../base.service';
import { City } from './city';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Country } from '../countries/country';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client';

@Injectable({
  providedIn: 'root'
})
export class CityService
  extends BaseService<City> {

  constructor(
    http: HttpClient,
    private apollo: Apollo
  ) {
    super(http);
  }

  override getData(paging: Paging): Observable<ApiResult<City>> {
    return this.apollo
      .query({
        query: gql`
          query GetCitiesApiResult
          (
            $pageIndex: Int!,
            $pageSize: Int!,
            $sortColumn: String,
            $sortOrder: String,
            $filterColumn: String,
            $filterQuery: String)
            {
              citiesApiResult(
                pageIndex: $pageIndex
                pageSize: $pageSize
                sortColumn: $sortColumn
                sortOrder: $sortOrder
                filterColumn: $filterColumn
                filterQuery: $filterQuery
              )
              {
                data {
                  id
                  name
                  latitude
                  longitude
                  countryId
                  countryName
                },
                pageIndex
                pageSize
                totalCount
                totalPages
                sortColumn
                sortOrder
                filterColumn
                filterQuery
              }
            }
        `,
        variables: {
          ...paging
        }
      })
      .pipe(map((result: any) => result.data.citiesApiResult));
  }

  override get(id: number): Observable<City> {
    return this.apollo
      .query({
        query: gql`
          query GetCityById($id: Int!) {
            cities(where: { id: { eq: $id } }) {
              nodes {
                id
                name
                latitude
                longitude
                countryId
              }
            }
          }
        `,
        variables: { id },
      })
      .pipe(map((result: any) => result.data.cities.nodes[0]));
  }

  override put(item: City): Observable<City> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation UpdateCity($city: CityDTOInput!) {
            updateCity(cityDTO: $city) {
              id
              name
              latitude
              longitude
              countryId
            }
          }
        `,
        variables: {
          city: this.stripTypenames(item)
        }
      })
      .pipe(map((result: any) => result.data.updateCity));
  }

  override post(item: City): Observable<City> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation AddCity($city: CityDTOInput!) {
            addCity(cityDTO: $city) {
              id
              name
              latitude
              longitude
              countryId
            }
          }
        `,
        variables: {
          city: this.stripTypenames(item)
        }
      })
      .pipe(map((result: any) => result.data.addCity));
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
