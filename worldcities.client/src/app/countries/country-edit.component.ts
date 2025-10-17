import {Component, OnInit} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Country} from './country';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map, Observable} from 'rxjs';
import {BaseFormComponent} from '../base-form.component';
import {CountryService} from './country.service';

@Component({
  selector: 'app-country-edit',
  standalone: false,
  templateUrl: './country-edit.component.html',
  styleUrl: './country-edit.component.scss'
})
export class CountryEditComponent
  extends BaseFormComponent implements OnInit {
  title?: string;
  country?: Country;
  id?: number;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private countryService: CountryService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['',
        Validators.required,
        this.isDupeField("name")
      ],
      iso2: ['',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z]{2}$/)
        ],
        this.isDupeField("iso2")
      ],
      iso3: ['',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z]{3}$/)
        ],
        this.isDupeField("iso3")
      ]
    });

    this.customMessages = {
      'iso2': {
        'pattern': 'requires 2 letters.'
      },
      'iso3': {
        'pattern': 'requires 3 letters.'
      }
    }

    this.loadData();
  }

  loadData() {
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;

    if (!this.id) {
      this.title = 'Create a new Country';
      return;
    }

    this.countryService.get(this.id).subscribe({
      next: (result) => {
        this.country = result;
        this.title = `Edit - ${this.country.name}`;
        this.form.patchValue(this.country);
      },
      error: (error) => console.error(error)
    });
  }

  onSubmit() {
    let country = (this.id) ? this.country : <Country>{};
    if (country) {
      country.name = this.form.controls['name'].value;
      country.iso2 = this.form.controls['iso2'].value;
      country.iso3 = this.form.controls['iso3'].value;

      if (this.id) {
        // EDIT mode

        this.countryService.put(country)
          .subscribe({
            next: (result) => {
              console.log("Country " + country!.id + " has been updated.");

              // go back to countries view
              this.router.navigate(['/countries']);
            },
            error: (error) => console.error(error)
          });
      }
      else {
        // ADD NEW mode
        this.countryService
          .post(country)
          .subscribe({
            next: (result) => {
              console.log("Country " + result.id + " has been created.");

              // go back to countries view
              this.router.navigate(['/countries']);
            },
            error: (error) => console.error(error)
          });
      }
    }
  }

  isDupeField(fieldName: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{
      [key: string]: any
    } | null> => {

      let params = new HttpParams()
        .set("countryId", (this.id) ? this.id.toString() : "0")
        .set("fieldName", fieldName)
        .set("fieldValue", control.value);
      const url = environment.baseUrl + 'api/Countries/IsDupeField';
      return this.countryService.isDupeField(this.id ?? 0,
        fieldName,
        control.value)
        .pipe(map(result => {
          return (result ? { isDupeField: true } : null);
        }));
    }
  }
}
