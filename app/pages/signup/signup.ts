import {Page, NavController, Events, Alert} from 'ionic-angular';
import {HomePage} from '../home/home';
import {FormBuilder, Validators, FORM_BINDINGS, ControlGroup} from 'angular2/common'

import {DataService} from '../../providers/data-service';
import {HttpService} from '../../providers/http-service';
import {ValidationService} from '../../providers/validator-service';


@Page({
  providers: [HttpService, ValidationService],
  templateUrl: 'build/pages/signup/signup.html'
})
export class SignupPage {
    nav: any;
    events: any;
    http: any;

    submitted = false;
    signupForm: ControlGroup;

  constructor(formBuilder: FormBuilder, nav: NavController, events: Events, http: HttpService) {
    this.nav = nav;
    this.http = http;
    this.events = events;

    // Build signupForm with all validators
    this.signupForm = formBuilder.group({
            username: ["", Validators.compose([Validators.required, ValidationService.emailValidator])],
            passwords: formBuilder.group({
                password: ["", Validators.compose([Validators.required, ValidationService.passwordValidator])],
                passwordconfirm: ["", Validators.compose([Validators.required, ValidationService.passwordValidator])]
            }, {validator: ValidationService.matchingPasswords('password', 'confirmpassword')})
        });
  }

  onSignup() {
    this.submitted = true;

    if (this.signupForm.valid) {
      // build the request
      let request = {};
      request['mail'] = this.signupForm.value.mail;
      request['password'] = this.signupForm.value.password;

      // make the request
      this.http.makeBackendRequest('POST', 'auth/register', request, this.onRegisterSuccess, this.onRegisterError, false);
    }
  }

  onRegisterSuccess(response) {
    // publish event to update the database
    this.events.publish('user:login', response);

    // show alert to inform user and redirect him to Home
    this.showAlert("Connexion réussi", "Merci d'utiliser notre application, bon networking !", {
        text: 'Ok',
        handler: () => {
          this.nav.setRoot(HomePage);
        }
    });
  }

  onRegisterError(errorMessage) {
    let code = errorMessage.status;
    if (typeof code == "undefined")
        this.showAlert("Serveur non-accessible", "Notre serveur n'a pas répondu, veuillez réessayez.", "Ok");
    else if (code == "404")
        this.showAlert("Erreur d'Authentification", "Aucun utilisateur trouvé pour cet email.", "Ok");
    else if (code == "500")
        this.showAlert("Erreur interne", "Nous avons eu un problème, veuillez réessayez.", "Ok");
    else if (code == "403")
        this.showAlert("Erreur d'Authentification", "Le mot-de-passe est incorrect.", "Ok");
  }

  private showAlert(title, subTitle, button) {
    let alert = Alert.create({
      title: title,
      subTitle: subTitle,
      buttons: [button]
    });
    this.nav.present(alert);
  }

}
