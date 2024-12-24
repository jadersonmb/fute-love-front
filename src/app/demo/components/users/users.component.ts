import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { UsersService } from 'src/app/demo/service/users.service';
import { Users } from '../../api/useres';
import { Table } from 'primeng/table';
import { FormControl, FormBuilder, FormGroup, Validators  } from '@angular/forms';

@Component({
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class UsersComponent implements OnInit {
  
  users: Users[] = [];

  user: Users = {};

  loading: boolean = true;

  usersDialog : boolean = false;

  submitted: boolean = false;
  
  userform : FormGroup

  selectedUsers: Users[] = [];

  showButtons: boolean = false;

  constructor(private usersService: UsersService, private formBuilder: FormBuilder, private messageService: MessageService) {} 

  ngOnInit() {
    this.userform = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    })

    this.submitted = false;
    this.usersService.getAllUsers().subscribe(data => {
        this.users = data.content;
        this.loading = false;
      });

    this.userform.valueChanges.subscribe((value) => {
       console.log('Form atualizado:', value);
    });
  }

  onSort() {
  }

  openNew() {
    this.user = {};
    this.submitted = false;
    this.showButtons = true;
    this.usersDialog = true;
    console.log(this.showButtons);
  }

  edit(user: Users) {
    this.user = { ...user };
    this.usersDialog = true;
    this.showButtons = false;
  }

  update(){ 
    this.submitted = true
    this.usersService.updateUsers(this.user).subscribe({
      next: (data) => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Successful:', 
          detail: 'User Updated', 
          life: 3000 
        });
      },
      error: (error) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error:', 
          detail: 'The try update user', 
          life: 3000 
        });
      }
    });
    this.hideDialog();
    this.userform.reset();
    this.selectedUsers = [];
    this.ngOnInit();
  }

  editModal() { 
    if(this.selectedUsers.length > 0){
      this.edit(this.selectedUsers[0]);
    }
  }

  save(){
    if (this.userform.valid) {
      this.submitted = true
      this.usersService.createUsers(this.userform.value).subscribe({next: (data) => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Successful:', 
          detail: 'User saved', 
          life: 3000 
        });
      },
      error: (error) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error:', 
          detail: error.error.details, 
          life: 3000 
        });
      }
      })
      this.hideDialog();
      this.userform.reset();
      this.selectedUsers = [];
      this.ngOnInit();
    }
  }

  refreshTable(){
    this.ngOnInit();
  }
  
  hideDialog() {
    this.submitted = false;
    this.usersDialog = false;
    this.userform.reset();
    this.selectedUsers = [];
  }

  onGlobalFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.usersService.globalSearch(value).subscribe(data => {
      this.users = data.content;
    })
  }

}
