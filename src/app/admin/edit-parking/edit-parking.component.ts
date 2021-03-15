import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first, map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Parking } from 'src/app/_models/parking';
import { ParkingService } from 'src/app/_services/parking.service';

@Component({
  selector: 'app-edit-parking',
  templateUrl: './edit-parking.component.html',
  styleUrls: ['./edit-parking.component.css']
})
export class EditParkingComponent implements OnInit {

  id: number;
  parking: Parking;
  editParkingForm: FormGroup;
  submitted = false;

  filteredStateOptions: Observable<string[]>;

  constructor(
    private formBuilder: FormBuilder,
    private parkingService: ParkingService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    //this.parking = this.parkingService.;
    this.parking;
    console.log(this.parking);
    this.editParkingForm = this.formBuilder.group({
      vehicleNumber: ['', Validators.required],
        driverName: ['', Validators.required],
        withCleaningService: ['', Validators.required],
        parkingCost: ['', Validators.required],
        cleaningCost: ['', Validators.required]
    });

    this.parkingService
      .getById(this.id)
      .pipe(first())
      .subscribe((x: { [key: string]: any; }) => this.editParkingForm.patchValue(x));

  }

  hide = true;

  get f() {
    return this.editParkingForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.editParkingForm.invalid) {
      return;
    }

    alert(JSON.stringify(this.editParkingForm.value));

    this.parkingService.update(this.editParkingForm.value, this.id).subscribe(
      () => {
        this._snackBar.open('✓ Edited', '', {
          duration: 1500,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
        this.router.navigate(['/admin']);
      },
      (error: { error: { message: any; }; }) => {
        this._snackBar.open(`✗ Error ${error.error.message}`, '', {
          duration: 1500,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
        this.onReset();
        console.log(error);
      }
    );
  }

  onReset(): void {
    this.submitted = false;
    this.editParkingForm.reset();
  }

}
