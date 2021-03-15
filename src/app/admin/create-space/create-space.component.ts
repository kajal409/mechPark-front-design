import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';
import { RegisterRole } from 'src/app/_models/registerRole';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SpaceService } from 'src/app/_services/space.service';

@Component({
  selector: 'app-create-space',
  templateUrl: './create-space.component.html',
  styleUrls: ['./create-space.component.css']
})
export class CreateSpaceComponent implements OnInit {

  createSpaceForm: FormGroup;
  submitted = false;
  roles: RegisterRole[] = [
    { value: 'AllocationManager', viewValue: 'Allocation Manager' },
    { value: 'ParkingManager', viewValue: 'Parking Manager' },
    { value: 'User', viewValue: 'Customer' }
  ];

  filteredStateOptions: Observable<string[]>;
  constructor(
    private formBuilder: FormBuilder,
    public spaceService: SpaceService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.createSpaceForm = this.formBuilder.group(
      {
        code: ['', Validators.required],
        occupiedCapacity: ['', Validators.required],
        totalCapacity: ['', Validators.required],
      },
    );

   /* this.filteredStateOptions = this.createSpaceForm.controls[
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
*/
  }
  get f() {
    return this.createSpaceForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.createSpaceForm.invalid) {
      return;
    }

    alert(JSON.stringify(this.createSpaceForm.value));

    this.spaceService
      .create(this.createSpaceForm.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this._snackBar.open('✓ Space Created', '', {
            duration: 1500,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
          console.log('Space Created Success');
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
        this.createSpaceForm.reset();
      }
}
