import {CitiesComponent} from './cities.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AngularMaterialModule} from '../angular-material.module';
import {RouterModule} from '@angular/router';
import {CityService} from './city.service';
import {of} from 'rxjs';
import {ApiResult} from '../base.service';
import {City} from './city';

describe('CitiesComponent', () => {
  let component: CitiesComponent;
  let fixture: ComponentFixture<CitiesComponent>;

  beforeEach(async () => {
    // Create a mock cityService object with a mock 'getData' method
    let cityService = jasmine.createSpyObj<CityService>('CityService',['getData']);

    // Configure the 'getData' spy method
    cityService.getData.and.returnValue(
      // return an Observable with some test data
      of<ApiResult<City>>(<ApiResult<City>>{
        data: [
          <City>{
            name: 'TestCity1',
            id: 1,
            latitude: 1,
            longitude: 1,
            countryId: 1,
            countryName: 'TestCountry1'
          },
          <City>{
            name: 'TestCity2',
            id: 2,
            latitude: 1,
            longitude: 1,
            countryId: 1,
            countryName: 'TestCountry1'
          },
          <City>{
            name: 'TestCity3',
            id: 3,
            latitude: 1,
            longitude: 1,
            countryId: 1,
            countryName: 'TestCountry1'
          }
        ],
        totalCount: 3,
        pageIndex: 0,
        pageSize: 10
      }));

    await TestBed.configureTestingModule({
      declarations: [CitiesComponent],
      imports: [
        AngularMaterialModule,
        RouterModule.forRoot(
          [
            { path: 'cities',  component: CitiesComponent },
          ]
        )
      ],
      providers: [
        {
          provide: CityService,
          useValue: cityService
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CitiesComponent);
    component = fixture.componentInstance;
    component.paginator = jasmine.createSpyObj(
      "MatPaginator", ["length", "pageIndex", "pageSize"]
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a "Cities" title', () => {
    let title = fixture.nativeElement
      .querySelector('h1');
    expect(title.textContent).toEqual('Cities');
  });

  it('should contain a table with a list of one or more cities', () => {
    let table = fixture.nativeElement
      .querySelector('table.mat-mdc-table');
    let tableRows = table
      .querySelectorAll('tr.mat-mdc-row');
    console.log(tableRows);

    expect(tableRows.length).toBeGreaterThan(0);
  });
})
