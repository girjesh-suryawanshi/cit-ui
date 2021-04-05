import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { GlobalConfiguration } from 'src/app/config/global.config';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  countByAssignUsernameAndStatus(assignUsername: any, status: string) {
    return this.http.get(this.contextPath + '/project-problem-assignment/assign-username/' + assignUsername +'/status/'+status, { observe: 'response' }).pipe(map(
      (response: HttpResponse<any>) => {
        return response;
      }));
  }
  countAssignByUsername(assignUsername: any) {
    return this.http.get(this.contextPath + '/project-problem-assignment/assign-username/' + assignUsername, { observe: 'response' }).pipe(map(
      (response: HttpResponse<any>) => {
        return response;
      }));
  }

  countByUsername(username: any) {
    return this.http.get(this.contextPath + '/issue-master/user-name/' + username, { observe: 'response' }).pipe(map(
      (response: HttpResponse<any>) => {
        return response;
      }));
  }
  countByUsernameAndStatus(username: any,status:any) {
    return this.http.get(this.contextPath + '/issue-master/user-name/' + username +'/status/'+status, { observe: 'response' }).pipe(map(
      (response: HttpResponse<any>) => {
        return response;
      }));
  }

  contextPath: any;
  constructor(private http: HttpClient, private globalConfiguration: GlobalConfiguration) {
    this.contextPath = this.globalConfiguration.getBackendURLPrefix();
  }

  getAllAssignedProblem(username: string) {
    console.log("Inside getting users");
    return this.http.get(this.contextPath + '/project-problem-assignment/user-name/' + username, { observe: 'response' }).pipe(map(
      (response: HttpResponse<any>) => {
        return response;
      }));
  }

  getFileByTokenNumber(tokenNumber: string) {
    console.log("Inside getting users");
    return this.http.get(this.contextPath + '/file/token-number/' + tokenNumber, { observe: 'response' }).pipe(map(
      (response: HttpResponse<any>) => {
        return response;
      }));
  }


  resolveIssueByTokenNumber(tokenNumber:string,comments:string,uploadFiles: File [] ) {
    let formData = new FormData();
        uploadFiles.forEach(file  => {
        formData.append('files', file);
    });
    formData.append('tokenNumber',tokenNumber);
    formData.append('comments',comments);
    // formData.append('requestInformation', JSON.stringify(requestInformation));

    return this.http.post(this.contextPath + 'project-problem-assignment/accept', formData, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        return response;
      }));
  }

  ddasdarresolveIssueByTokenNumber(tokenNumber: string,comments:string) {

    let formData = new FormData();
    formData.append('tokenNumber',tokenNumber);
    formData.append('comments',comments);
    return this.http.post(this.contextPath + 'project-problem-assignment/accept', formData, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        return response;
      }));
    }

  rejectIssueByTokenNumber(tokenNumber: string,comments:string) {
    let formData = new FormData();
    formData.append('tokenNumber',tokenNumber);
    formData.append('comments',comments);
    return this.http.post(this.contextPath + 'project-problem-assignment/reject', formData, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        return response;
      }));
 }
 
 forwardIssueToParent(forwardIssue: any) {

  return this.http.post(this.contextPath + 'project-problem-assignment', forwardIssue, { observe: 'response' }).pipe(
    map((response: HttpResponse<any>) => {
      return response;
    }))
}

forwardIssueDirectly(forwardIssue: any) {

  return this.http.post(this.contextPath + 'project-problem-assignment/direct', forwardIssue, { observe: 'response' }).pipe(
    map((response: HttpResponse<any>) => {
      return response;
    }))
}

getUserByTokenNumber(tokenNumber: any) {
  console.log("Inside getting users");
  return this.http.get(this.contextPath + '/issue-status/token-number/' + tokenNumber, { observe: 'response' }).pipe(map(
    (response: HttpResponse<any>) => {
      return response;
    }));
}

getProjectProblemUserMapping(locationCode:string,projectName:string,projectModule:string,projectProblemStatement:string) {
  console.log("Inside getting users");
  return this.http.get(this.contextPath + '/project-problem-user-mapping/location-code/' + locationCode +'/project-name/'+projectName +'/project-module/'+ projectModule +'/project-problem-statement/'+projectProblemStatement, { observe: 'response' }).pipe(map(
    (response: HttpResponse<any>) => {
      return response;
    }));
}



}
