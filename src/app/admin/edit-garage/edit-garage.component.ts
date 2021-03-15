import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first, map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RegisterRole } from 'src/app/_models/registerRole';
import { Garage } from 'src/app/_models/garage';
import { GarageService } from 'src/app/_services/garage.service';

@Component({
  selector: 'app-edit-garage',
  templateUrl: './edit-garage.component.html',
  styleUrls: ['./edit-garage.component.css']
})
export class EditGarageComponent implements OnInit {

  id: number;
  garage: Garage;
  editGarageForm: FormGroup;
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
    private garageService: GarageService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.id = this.route.snapshot.params['id'];
    //this.garage = this.garageService.getById(this.id);
    this.garage;
    console.log(this.garage);
    this.editGarageForm = this.formBuilder.group({
      name: ['', Validators.required],
        address: ['', Validators.required],
        state: ['', Validators.required],
        hasCleaning: ['', Validators.required],
        totalspace: ['', Validators.required],
        occupiedCapacity: ['',Validators.required],
        parkingRate: ['', Validators.required],
        parkingManager : ['', Validators.required],
        allocationManaegr : ['', Validators.required]
    });

    
    this.garageService
      .getById(this.id)
      .pipe(first())
      .subscribe((x) => this.editGarageForm.patchValue(x));

    this.filteredStateOptions = this.editGarageForm.controls[
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
    return this.editGarageForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.editGarageForm.invalid) {
      return;
    }

    alert(JSON.stringify(this.editGarageForm.value));

    this.garageService.update(this.editGarageForm.value, this.id).subscribe(
      () => {
        this._snackBar.open('✓ Edited', '', {
          duration: 1500,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
        this.router.navigate(['/admin']);
      },
      (error) => {
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
    this.editGarageForm.reset();
  }

}
