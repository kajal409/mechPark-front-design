import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';


import { GarageService } from 'src/app/_services/garage.service';
import { Router } from '@angular/router';
import { RegisterRole } from 'src/app/_models/registerRole';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-garage',
  templateUrl: './create-garage.component.html',
  styleUrls: ['./create-garage.component.css']
})
export class CreateGarageComponent implements OnInit {

  createGarageForm: FormGroup;
  submitted = false;
  roles: RegisterRole[] = [
    { value: 'AllocationManager', viewValue: 'Allocation Manager' },
    { value: 'ParkingManager', viewValue: 'Parking Manager' },
    { value: 'User', viewValue: 'Customer' }
  ];
  stateOptions: string[] = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal'
  ];

  filteredStateOptions: Observable<string[]>;
  constructor(
    private formBuilder: FormBuilder,
    public garageSerivice: GarageService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.createGarageForm = this.formBuilder.group(
      {
        name: ['', Validators.required],
        address: ['', Validators.required],
        state: ['', Validators.required],
        hasCleaning: ['', Validators.required],
        totalspace: ['', Validators.required],
        occupiedCapacity: ['',Validators.required],
        parkingRate: ['', Validators.required]
      }
    );

    this.filteredStateOptions = this.createGarageForm.controls[
      'state'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.stateOptions.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  hide = true;

  get f() {
    return this.createGarageForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.createGarageForm.invalid) {
      return;
    }

    alert(JSON.stringify(this.createGarageForm.value));

    this.garageSerivice
      .create(this.createGarageForm.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this._snackBar.open('✓ Garage Created', '', {
            duration: 1500,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
          console.log('Garage Created Success');
          this.router.navigate(['/admin']);
        },
        (error) => {
          this._snackBar.open(`✗ Error ${error.error.message}`, '', {
            duration: 1500,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
          this.onReset();
          console.log(error);
        }
      );

  }

  onReset() {
    this.submitted = false;
    this.createGarageForm.reset();
  }

}
