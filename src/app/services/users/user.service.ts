import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { GlobalConfiguration } from 'src/app/config/global.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  contextPath: any;
  constructor(private http: HttpClient, private globalConfiguration: GlobalConfiguration) {
    this.contextPath = this.globalConfiguration.getBackendURLPrefix();
  }


  getAllProject() {
    console.log("Inside Location Code and Name Service");
    return this.http.get(this.contextPath + '/users', { observe: 'response' }).pipe(map(
      (response: HttpResponse<any>) => {
        return response;
      }));
  }



  getAllUsers(locationCode: string, role: any) {
    console.log("Inside getting users");
    return this.http.get(this.contextPath + '/users-detail/location-code/' + locationCode + '/role/' + role, { observe: 'response' }).pipe(map(
      (response: HttpResponse<any>) => {
        return response;
      }));
      
  }

  getUserByLocationCodeAndRole(locationCode: string, role: any) {
      return this.http.get(this.contextPath + '/users-detail/location-user/location-code/' + locationCode + '/role/' + role, { observe: 'response' }).pipe(map(
      (response: HttpResponse<any>) => {
        return response;
      }));
      
  }


  deleteById(id) {
    return this.http.delete(this.contextPath + "project-user-mapping/id/" + id, { observe: 'response' }).pipe(map((response: HttpResponse<any>) => {
      return response;
    }));
  }
}
