import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { AuthorizationService } from 'src/app/services/authorization-service/authorization.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { IssueMasterService } from 'src/app/services/project/issue-master.service';
import { IssueStatusService } from 'src/app/services/project/issue-status.service';
import { RequestInformationService } from 'src/app/services/project/request-information.service';
import { UserService } from 'src/app/services/users/user.service';
import { GlobalConstants } from 'src/app/utility/global.constants';
import { GobalutilityService } from 'src/app/utility/gobalutility.service';

@Component({
  selector: 'app-to-do-issue',
  templateUrl: './to-do-issue.component.html',
  styleUrls: ['./to-do-issue.component.css']
})
export class ToDoIssueComponent implements OnInit {

  loggedInUser: User;
  username: string;
  locationCode: string;
  assignedProblemStatement: any = [];
  files: any;
  isView: boolean;
  viewIssue: any;
  isDisable: boolean;
  isForward: boolean;
  isRequestInfo: boolean;
  isResolve: boolean;
  isReject: boolean;
  name: string;
  forwardIssue: any;
  requestInfoUser: any;
  requestInfoForm; rejectForm; resolveForm: FormGroup;
  requestForwardForm: FormGroup;
  requestInfoObject: any = {};
  isProcessing: boolean;
  officeType: string;
  statusList: any;
  requestInfoList: any = [];
  forwardUser: any;
  dtOptions: any = {};
  uploadFiles: File[] = [];
  isResolveIssueFile: boolean;
  resolveIssuefiles: any;
  isReopenIssueFile: boolean;
  reopenIssuefiles: any;
  role: string;
  users: any;


  constructor(private dashboardService: DashboardService,
    private issueMasterService: IssueMasterService, private issueStatusService: IssueStatusService,
    private authorizationService: AuthorizationService, private userService: UserService,
    private requestInformationService: RequestInformationService,
    private globalutilityService: GobalutilityService) { }

  ngOnInit(): void {

    this.requestInfoForm = new FormGroup({
      remark: new FormControl('', Validators.required),
      user: new FormControl('', Validators.required)

    });

    this.requestForwardForm = new FormGroup({
      remark: new FormControl('', Validators.required),
      user: new FormControl('', Validators.required)

    });

    this.resolveForm = new FormGroup({
      comments: new FormControl('', Validators.required),
      isAttachment: new FormControl(false)
    });

    this.rejectForm = new FormGroup({
      comments: new FormControl('', Validators.required),
    });



    this.loggedInUser = this.authorizationService.getLoggedInUser();
    this.username = this.loggedInUser.getUsername();
    this.locationCode = this.loggedInUser.getLocationCode();
    this.role = this.loggedInUser.getRole();
    this.name = this.loggedInUser.getName();
    this.officeType = this.loggedInUser.getOfficeType();
    this.getAllAssignedProblemStatement(this.username);

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50],
      processing: true
    };

  }

  getAllAssignedProblemStatement(username: any) {

    this.dashboardService.getAllAssignedProblem(username).subscribe(success => {

      if (success.status === 200) {
        console.log("Inside success assign problem found successfully");

        this.assignedProblemStatement = success.body;
      }
      else if (success.status === 204) {
        console.log("No content found");

        this.assignedProblemStatement = [];
      }

    }, error => {

      console.log("Inside error while getting assign problem");

    })

  }

  viewResolveIssueFileClicked(file: any) {
    this.isResolveIssueFile = true;
    this.issueMasterService.getResolveIssueFileByTokenNumber(file.tokenNumber).subscribe(success => {
      if (success.status === 200) {
        console.log("Resolve Issue File Found Successfully By TokenNumber");
        this.resolveIssuefiles = success.body;
        console.log(this.resolveIssuefiles);
      } else if (success.status === 204) {
        console.log("No File Found While Getting  File By TokenNumber");
      }
    }, error => {
      console.log("Getting Error while getting File By TokenNumber");
      console.log(error);
    })
  }

  onClickViewResolveIssueFile(file: any) {
    console.log("onClickViewResolveIssueFile");
    this.issueMasterService.downloadFileByTokenNumberAndFileName(file.tokenNumber, file.name, GlobalConstants.FALSE).subscribe(success => {
      this.saveFile(success, file.originalName)
    }, error => {
      this.handleError(error);
    })
  }

  viewReopenFileClicked(file: any) {
    this.isReopenIssueFile = true;
    console.log("reopen file clicked");
    console.log(file);
    this.issueMasterService.getReopenIssueFileByTokenNumber(file.tokenNumber).subscribe(success => {
      if (success.status === 200) {
        console.log("Resolve Issue File Found Successfully By TokenNumber");
        this.reopenIssuefiles = success.body;
        console.log(this.resolveIssuefiles);
      } else if (success.status === 204) {
        console.log("No File Found While Getting  File By TokenNumber");
      }
    }, error => {
      console.log("Getting Error while getting File By TokenNumber");
      console.log(error);
    })
  }

  onClickDownloadReopenIssueFile(file: any) {
    console.log("onClickViewResolveIssueFile");
    this.issueMasterService.downloadReopenIssueFileByTokenNumberAndFileName(file.tokenNumber, file.name, GlobalConstants.FALSE).subscribe(success => {
      this.saveFile(success, file.originalName)
    }, error => {
      this.handleError(error);
    })
  }



  public onClickView(ps: any) {

    console.log("Checking Status");
    console.log(ps.status)

    if (ps.status === 'COMPLETED' || ps.status === 'REJECTED' || ps.status === 'FORWARDED') {
      this.isDisable = true;
    } else {
      this.isDisable = false;
    }
    this.viewIssue = ps;
    this.isView = true;
    this.getFileByTokenNumber(ps.tokenNumber);
    this.getIssueStatusByTokenNumber(ps.tokenNumber);
    this.getByUsernameAndTokenNumber(this.username, ps.tokenNumber);
    this.viewResolveIssueFileClicked(ps);
    this.viewReopenFileClicked(ps);
    console.log("View Clicked");
    console.log(ps);

  }

  getIssueStatusByTokenNumber(tokenNumber: any) {
    this.issueStatusService.getRequestInformationByTokenNumber(tokenNumber).subscribe(success => {

      if (success.status === 200) {
        this.statusList = success.body;
        console.log("issue status");
        console.log(this.statusList);
      } if (success.status === 204) {
        console.log(success);
      }


    }, error => {
      console.log(error);
    })
  }

  public onClickBack() {
    this.isView = false;
    this.isForward = false;

  }

  onClickResolve(ps: any) {
    this.isForward = false;
    this.isReject = false;
    this.isRequestInfo = false;
    this.isResolve = true;
  }

  onResolveSubmit() {
    this.isProcessing = true;
    this.dashboardService.resolveIssueByTokenNumber(this.viewIssue.tokenNumber, this.resolveForm.value.comments, this.uploadFiles).subscribe(success => {
      if (success.status === 201) {
        this.globalutilityService.successAlertMessage("Issue resolve successfully");
        this.isProcessing = false;
        this.resetResolveForm();
        this.onClickResolveBack();
        this.isView = false;
      }
      this.getAllAssignedProblemStatement(this.username);
    }, error => {
      if (error.status === 417) {
        this.isProcessing = false;
        this.resetResolveForm();
        this.onClickResolveBack();
        this.isView = false;
        this.globalutilityService.errorAlertMessage("Unable to resolve Issue!!");

      }
    })

  }

  onClickResolveBack() {
    this.isForward = false;
    this.isReject = false;
    this.isRequestInfo = false;
    this.isResolve = false;
  }

  onClickReject(ps: any) {
    this.isForward = false;
    this.isReject = true;
    this.isRequestInfo = false;
    this.isResolve = false;
    console.log("Resolve Issue Clicked");
    console.log(ps);

  }

  onRejectSubmit() {
    this.isProcessing = true;
    this.dashboardService.rejectIssueByTokenNumber(this.viewIssue.tokenNumber, this.rejectForm.value.comments).subscribe(success => {
      if (success.status === 201) {
        this.globalutilityService.successAlertMessage("Issue rejected successfully");
        this.isProcessing = false;
        this.resetRejectForm();
        this.isReject = false;
        this.getAllAssignedProblemStatement(this.username);
        this.onClickResolveBack();
        this.isView = false;
      }

    }, error => {
      if (error.status === 417) {
        this.isProcessing = false;
        this.resetRejectForm();
        this.globalutilityService.errorAlertMessage("Unable to reject issue !!");
      }
    })

  }

  onClickRejectBack() {
    this.isForward = false;
    this.isReject = false;
    this.isRequestInfo = false;
    this.isResolve = false;

  }

  onClickforward(viewIssue: any) {
    this.isForward = true;
    this.isReject = false;
    this.isRequestInfo = false;
    this.isResolve = false;
    console.log("forward click print log");
    console.log(viewIssue);
    if(this.role === 'ERP-ADMIN'){
      console.log("If part called of ERP");
      
      this.getUserByLocationCodeAndRole();
    }else{
      console.log("Else part Called");      
      this.getProjectProblemUserMapping(this.locationCode, viewIssue.projectName, viewIssue.projectModule, viewIssue.projectProblemStatement);
    }
  }

  getProjectProblemUserMapping(locationCode: string, projectName: any, projectModule: any, projectProblemStatement: any) {
    this.dashboardService.getProjectProblemUserMapping(locationCode, projectName, projectModule, projectProblemStatement).subscribe(success => {
      if (success.status === 200) {
        this.forwardUser = success.body;
      }

    }, error => {
      console.log("inside error");

    })
  }

  public onClickForwardBack() {
    this.isForward = false;
    this.isReject = false;
    this.isRequestInfo = false;
    this.isResolve = false;
  }

  onClickRequestInfo(viewIssue: any) {
    this.isForward = false;
    this.isReject = false;
    this.isRequestInfo = true;
    this.isResolve = false;
    console.log("request info click");
    console.log(viewIssue);
    this.dashboardService.getUserByTokenNumber(viewIssue.tokenNumber).subscribe(success => {
      console.log("Get issue status");
      console.log(success);
      this.requestInfoUser = success.body;
      console.log(this.requestInfoUser);

    }, error => {

      console.log("error");
    })
  }

  public onClickRequestInfoBack() {
    this.isRequestInfo = false;
    this.reset();
  }

  onForwardSubmit() {
    this.prepareFarwardIssueObject();
  
     this.dashboardService.forwardIssueToParent(this.forwardIssue).subscribe(success => {
      if (success.status === 201) {
        this.globalutilityService.successAlertMessage("Issue Forwarded Successfully")
        this.isForward = false;
        this.getAllAssignedProblemStatement(this.username);
        this.resetForwardForm();
        this.onClickResolveBack();
        this.isView = false;
      }
    }, error => {
      if (error.status === 417) {
        this.globalutilityService.errorAlertMessage("Unable to forward issue")
        this.isForward = false;
        this.resetForwardForm()
      }
    })

  }

  private prepareFarwardIssueObject() {
    if(this.role==='ERP-ADMIN'){
      this.forwardIssue.assignUsername = this.requestForwardForm.value.user.username;
      this.forwardIssue.assignName = this.requestForwardForm.value.user.name;
      this.forwardIssue.remark = this.requestForwardForm.value.remark;
      console.log("If ERP-admin true object is"); 
      console.log(this.forwardIssue); 
      this.dashboardService.forwardIssueDirectly(this.forwardIssue).subscribe(success => {
        if (success.status === 201) {
          this.globalutilityService.successAlertMessage("Issue Forwarded Successfully")
          this.isForward = false;
          this.getAllAssignedProblemStatement(this.username);
          this.resetForwardForm();
          this.onClickResolveBack();
          this.isView = false;
        }
      }, error => {
        if (error.status === 417) {
          this.globalutilityService.errorAlertMessage("Unable to forward issue")
          this.isForward = false;
          this.resetForwardForm()
        }
      })

    }else{
      console.log("If ERP-admin false object is");         
     this.forwardIssue = this.viewIssue;
     this.forwardIssue.remark = this.requestForwardForm.value.remark;
     console.log(this.forwardIssue);
     this.dashboardService.forwardIssueToParent(this.forwardIssue).subscribe(success => {
      if (success.status === 201) {
        this.globalutilityService.successAlertMessage("Issue Forwarded Successfully")
        this.isForward = false;
        this.getAllAssignedProblemStatement(this.username);
        this.resetForwardForm();
        this.onClickResolveBack();
        this.isView = false;
      }
    }, error => {
      if (error.status === 417) {
        this.globalutilityService.errorAlertMessage("Unable to forward issue")
        this.isForward = false;
        this.resetForwardForm()
      }
    })
    }

  }

  getFileByTokenNumber(tokenNumber: any) {

    this.dashboardService.getFileByTokenNumber(tokenNumber).subscribe(success => {
      console.log(success.body);
      this.files = success.body;
    }, error => {

    })

  }

  onSubmitRequestInfo() {
    this.prepareRequestInfoObject();
    console.log("Request info object");
    console.log(this.requestInfoForm);
    console.log(this.requestInfoForm.value);
    this.requestInformationService.requestInformationToOrigin(this.requestInfoObject).subscribe(success => {
      console.log("Inside success");
      console.log(success);
      if (success.status === 201) {
        this.globalutilityService.successAlertMessage("Request info sent successfully")
        this.reset();
        this.isRequestInfo = false;
        this.isView = false;

      }
    },
      error => {
        if (error.status === 417) {
          this.globalutilityService.errorAlertMessage("Unable to sent request info");
          this.isRequestInfo = false;
        }

      })
  }

  prepareRequestInfoObject() {
    this.requestInfoObject.tokenNumber = this.requestInfoForm.value.user.tokenNumber;
    this.requestInfoObject.username = this.requestInfoForm.value.user.createdBy;
    this.requestInfoObject.name = this.requestInfoForm.value.user.createdName;
    this.requestInfoObject.requestedUsername = this.username;
    this.requestInfoObject.requestedName = this.name;
    this.requestInfoObject.requestMessage = this.requestInfoForm.value.remark;

  }


  reset() {
    this.requestInfoForm.patchValue({
      remark: '',
      user: ''
    });
  }

  resetForwardForm() {
    this.requestForwardForm.patchValue({
      remark: ''
    });
  }

  resetResolveForm() {
    this.uploadFiles = [];
    this.resolveForm.patchValue({
      comments: '',
      isAttachment: ''
    });
  }

  resetRejectForm() {
    this.rejectForm.patchValue({
      comments: ''
    });
  }

  viewFileClicked(file: any) {
    console.log("file view Clicked");
    console.log(file);
    this.issueMasterService.viewFile(file.tokenNumber, file.name, GlobalConstants.FALSE).subscribe(success => {
      this.saveFile(success, file.originalName)
    }, error => {
      this.handleError(error);
    })
  }

  private getUserByLocationCodeAndRole() {
    console.log('Getting USers');
    this.userService.getUserByLocationCodeAndRole(this.locationCode, 'ERP-ADMIN').subscribe(success => {
      console.log(success.body);
      this.users = success.body;
    }, () => {

      // this.project=succes.body;

    });

  }


  getByUsernameAndTokenNumber(username: any, tokenNumber: any) {
    this.requestInformationService.getByUsernameAndTokenNumber(username, tokenNumber).subscribe(success => {

      console.log("Getting Information List As view Clicked");

      console.log(success);

      console.log(success.body);

      if (success.status === 200) {
        this.requestInfoList = success.body;

      } else if (success.status === 204) {
        this.requestInfoList = [];
      }

    }, error => {

      console.log("Insise error");
    })

  }

  onFileChange(event) {

    this.uploadFiles = [];

    const size = event.srcElement.files[0].size;

    console.log(size)

    if (size < 1000000) {
      if (event.target.files.length <= 2) {

        for (var i = 0; i < event.target.files.length; i++) {
          this.uploadFiles.push(event.target.files[i]);
        }
      } else {
        this.globalutilityService.errorAlertMessage("Maximum 2 File Allow to upload");
      }

    } else {
      this.globalutilityService.errorAlertMessage("File Size greater 1 Mb");
    }
  }


  isAttachmentClicked() {
    this.resolveForm.get('isAttachment').valueChanges.subscribe(checked => {
      if (checked) {
        const validators = [Validators.required];
        this.resolveForm.addControl('attachment', new FormControl('', validators));
      } else {
        this.resolveForm.removeControl('attachment');
      }

    });

  }

  deleteFieldValue(index) {
    if (this.uploadFiles.length <= 1) {
      this.uploadFiles.splice(index, 1);
      this.resetFile();
    } else {
      this.uploadFiles.splice(index, 1);
    }
  }

  resetFile() {
    this.resolveForm.patchValue({
      attachment: '',
    });

  }

  /**
   * Save blob to file
   * @param blob
   */
  saveFile(success: any, fileName: string) {
    if (success) {
      let blob = GobalutilityService.createBlobFromResponse(success);
      this.globalutilityService.saveFile(blob, fileName);
    }
  }

  /**
   * Handle errors
   * @param error
   */
  handleError(error: any) {
    this.globalutilityService.parseStringFromBlob(error.error);
    this.globalutilityService.errorAlertMessage("Unable to download file.");
  }
}
