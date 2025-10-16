import {Component, OnInit} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, FormControl, FormGroup, Validators} from '@angular/forms';
import {City} from './city';
import {Country} from '../countries/country';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map, Observable} from 'rxjs';
import {BaseFormComponent} from '../base-form.component';

@Component({
  selector: 'app-city-edit',
  standalone: false,
  templateUrl: './city-edit.component.html',
  styleUrl: './city-edit.component.scss'
})
export class CityEditComponent
  extends BaseFormComponent implements OnInit {
  title?: string;
  city?: City;
  id?: number;
  countries?: Country[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
  ) {
    super();
  }

  ngOnInit(): void {
    const coordinateRegex = /^-?[0-9]+(\.[0-9]{1,4})?$/;
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      latitude: new FormControl('', [
        Validators.required,
        Validators.pattern(coordinateRegex),
      ]),
      longitude: new FormControl('', [
        Validators.required,
        Validators.pattern(coordinateRegex),
      ]),
      countryId: new FormControl('', Validators.required),
    }, null, this.isDupeCity());

    const coordinateInvalidMessage = 'requires a positive or negative number with 0-4 decimal values.';

    this.customMessages = {
      'latitude': {
        'pattern': coordinateInvalidMessage
      },
      'longitude': {
        'pattern': coordinateInvalidMessage
      }
    }

    this.loadData();
  }

  private loadData() {
    this.loadCountries();

    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;

    if (!this.id) {
      this.title = 'Create a new City';
      return;
    }

    const url = environment.baseUrl + 'api/cities/' + this.id;
    this.http.get<City>(url).subscribe({
      next: (result) => {
        this.city = result;
        this.title = `Edit - ${this.city.name}`;
        this.form.patchValue(this.city);
      },
      error: (error) => console.error(error)
    })
  }

  private loadCountries() {
    const url = environment.baseUrl + 'api/countries/';
    const params = new HttpParams()
      .set("pageIndex", 0)
      .set("pageSize", 999)
      .set("sortColumn", "name")
      .set("sortOrder", "asc");

    this.http.get(url, { params })
      .subscribe({
        next: (result: any) => {
          this.countries = result.data;
        },
        error: (error: any) => console.error(error)
      });
  }

  onSubmit() {
    let city = (this.id) ? this.city : <City>{};
    if(!city) {
      return;
    }

    city.name = this.form.controls['name'].value;
    city.latitude = +this.form.controls['latitude'].value;
    city.longitude = +this.form.controls['longitude'].value;
    city.countryId = +this.form.controls['countryId'].value;

    if (this.id) {
      const url = environment.baseUrl + 'api/cities/' + city.id;
      this.http.put<City>(url, city)
        .subscribe({
          next: (result: any) => {
            console.log(`City ${city!.id} has been saved successfully.`);
            this.router.navigate(['/cities']);
          },
          error: (error: any) => console.error(error)
        });
    } else {
      const url = environment.baseUrl + 'api/cities';
      this.http.post<City>(url, city)
        .subscribe({
          next: (result: any) => {
            console.log(`City ${result.id} has been created.`);
            this.router.navigate(['/cities']);
          },
          error: (error) => console.error(error)
        })
    }
  }

  private isDupeCity(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any} | null> => {
      let city = <City>{};
      city.id = (this.id) ? this.id : 0;
      city.name = this.form.controls['name'].value;
      city.latitude = this.form.controls['latitude'].value;
      city.longitude = this.form.controls['longitude'].value;
      city.countryId = +this.form.controls['countryId'].value;

      const url = environment.baseUrl + 'api/cities/isDupeCity';
      return this.http.post<boolean>(url, city).pipe(
        map(result => {
          return (result ? { isDupeCity: true } : null);
        })
      )
    }
  }
}
