import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';
import { RegisterRole } from 'src/app/_models/registerRole';
import { Observable } from 'rxjs';
import { ParkingService } from 'src/app/_services/parking.service';

@Component({
  selector: 'app-create-parking',
  templateUrl: './create-parking.component.html',
  styleUrls: ['./create-parking.component.css']
})
export class CreateParkingComponent implements OnInit {

  createParkingForm: FormGroup;
  submitted = false;
  roles: RegisterRole[] = [
    { value: 'AllocationManager', viewValue: 'Allocation Manager' },
    { value: 'ParkingManager', viewValue: 'Parking Manager' },
    { value: 'User', viewValue: 'Customer' }
  ];

  filteredStateOptions: Observable<string[]>;
  constructor(
    private formBuilder: FormBuilder,
    public parkingService: ParkingService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}


  ngOnInit(): void {

    this.createParkingForm = this.formBuilder.group(
      {
        vehicleNumber: ['', Validators.required],
        driverName: ['', Validators.required],
        withCleaningService: ['', Validators.required],
        parkingCost: ['', Validators.required],
        cleaningCost: ['', Validators.required]
      },
    );
  }

  hide = true;

  get f() {
    return this.createParkingForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.createParkingForm.invalid) {
      return;
    }

    alert(JSON.stringify(this.createParkingForm.value));

    this.parkingService
      .book(this.createParkingForm.value)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this._snackBar.open('✓ Parking Created', '', {
            duration: 1500,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
          console.log('Parking created Success');
          this.router.navigate(['/admin']);
        },
        (error: { error: { message: any; }; }) => {
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
    this.createParkingForm.reset();
  }

}
