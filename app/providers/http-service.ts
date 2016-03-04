import {Injectable} from 'angular2/core';
import {Http, Headers, Response, RequestOptions} from 'angular2/http';
import {Events} from 'ionic-angular';
import {DataService} from './data-service';

@Injectable ()
export class HttpService {

    http: any;
    event: any;
    url = 'http://localhost:4242/';
    data: any;
    authToken: any;

    constructor(http: Http, event:Events, data: DataService) {
      this.http = http;
      this.event = event;
      this.data = data;

      // if we get authToken, keep it or wait for a login event to retrieve it.
      data.get('user.auth').then((data) => {
        if (data)
          this.authToken = data;
        else {
          event.subscribe('user.login', (user) => {
              this.authToken = user.id + ':' + user.accessToken;
          });
        }
      });
    }

    /**
    *   A super method to make http request to our backend
    *
    *   method : POST / GET / PUT / DELETE
    *   route : /example/route
    *   request : object that you wanna post/put
    *   successCallback
    *   errorCallback
    *   authNeeded : if the Authorization header is required
    */
    makeBackendRequest(method, route, request, successCallback, errorCallback, authNeeded) {
      let headers = new Headers({ 'Content-Type': 'application/json'});
      if (authNeeded) {
          headers['Authorization'] = this.authToken;
      }
      let options = new RequestOptions({ headers: headers });

      console.log("request on : " + this.url + route);
      if (method !== 'GET')
        console.log("content : " + JSON.stringify(request));

      let httpRequest: any;
      if (method === 'GET')
        httpRequest = this.http.get(this.url + route, options);
      else if (method === 'PUT')
        httpRequest = this.http.put(this.url + route, JSON.stringify(request), options);
      else if (method === 'POST')
        httpRequest = this.http.post(this.url + route, JSON.stringify(request), options);
      else if (method === 'DELETE')
        httpRequest = this.http.delete(this.url + route, JSON.stringify(request), options);

      httpRequest.map(res => res.json()).subscribe(
        data => {
            successCallback(data);
            console.log("response got : " + JSON.stringify(data));
        }, err => {
            errorCallback(err);
            console.log("got an error : " + JSON.stringify(err));
        }
      );

    }


}