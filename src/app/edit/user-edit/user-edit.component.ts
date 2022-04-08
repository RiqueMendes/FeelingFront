import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from 'src/app/model/User';
import { AlertsService } from 'src/app/service/alerts.service';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  user: UserModel = new UserModel();
  idUser: number;

  confPassword: string;
  tyUser: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertsService
  ) {}

  ngOnInit() {
    window.scroll(0, 0);

    if (environment.token == '') {
      this.alertService.showAlertWarning('Sua sessão expirou, faça o login novamente');
      this.router.navigate(['/login']);
    }

    this.idUser = this.route.snapshot.params['id'];
    this.findByIdUser(this.idUser);
  }

  confirmPassword(event: any) {
    this.confPassword = event.target.value;
  }

  typeUser(event: any) {
    this.tyUser = event.target.value;
  }

  findByIdUser(id: number) {
    this.authService.getByIdUser(id).subscribe((resp: UserModel) => {
      this.user = resp;
      this.user.password = '';
    });
  }

  update() {
    this.user.type = this.tyUser;
    console.log(this.user);
    if (this.user.password != this.confPassword) {
      this.alertService.showAlertDanger('As senhas não coincidem.');
    } else {
      this.authService.update(this.user).subscribe((resp: UserModel) => {
        this.user = resp;
        this.alertService.showAlertSuccess('Usuário Atualizado com sucesso!');

        environment.token = '';
        environment.name = '';
        environment.id = 0;
        environment.photo= '';

        this.router.navigate(['/entrar']);
      });
    }
  }
}