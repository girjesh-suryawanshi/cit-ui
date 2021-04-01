import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthorizationService } from 'src/app/services/authorization-service/authorization.service';
import { ProjectUserMappingService } from 'src/app/services/project/project-user-mapping.service';
import { UserService } from 'src/app/services/users/user.service';
import { ProjectDescriptionService } from 'src/app/services/project/project-description.service';
import { ProjectProblemStatementService } from 'src/app/services/project/project-problem-statement.service';
import { IssueMasterService } from 'src/app/services/project/issue-master.service'
import { GobalutilityService } from 'src/app/utility/gobalutility.service'
import { IssueMaster } from 'src/app/models/issueMaster.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-add-issue',
  templateUrl: './add-issue.component.html',
  styleUrls: ['./add-issue.component.css']
})
export class AddIssueComponent implements OnInit {


  constructor(private authorizationService: AuthorizationService, private projectDescriptionService: ProjectDescriptionService, private issueMasterService: IssueMasterService,
    private userService: UserService, private globalutilityService: GobalutilityService, private projectUserMappingService: ProjectUserMappingService, private projectProblemStatmentService: ProjectProblemStatementService) { }

  projectsOic: any;

  projectsOther: any;

  role: string;

  username: string;

  loggedInUser: User;

  locationCode: any;

  locationName: string;

  officeType : string;

  name: string;

  moduleList: any;

  isOther: boolean;

  projectProblemStatmentList: any;

  insertIssueMaster: any = {};

  tokenId: any;

  issueMasterModel: IssueMaster;

  myFiles: File[] = [];

  issueMasterForm: FormGroup;

  isProcessing :boolean;

  mobileNumber:any;

  ngOnInit() {
    this.issueMasterForm = new FormGroup({
      projectName: new FormControl('', Validators.required),
      projectModule: new FormControl('', Validators.required),
      projectProblemStatement: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      isAttachment: new FormControl(false),
     

    });
    this.loggedInUser = this.authorizationService.getLoggedInUser();
    this.role = this.loggedInUser.getRole();
    this.username = this.loggedInUser.getUsername();
    this.name = this.loggedInUser.getName();
    this.locationCode = this.loggedInUser.getLocationCode();
    this.mobileNumber =this.loggedInUser.getMobileNo();
    this.locationName = this.loggedInUser.getLocationShortName();
    this.officeType = this.loggedInUser.getOfficeType();
    console.log(this.loggedInUser);
    this.getOicProject();
    this.getOtherProject();

  }

  isAttachmentClicked() {
    this.issueMasterForm.get('isAttachment').valueChanges.subscribe(checked => {
      if (checked) {
        const validators = [Validators.required];
        this.issueMasterForm.addControl('attachment', new FormControl('', validators));
      } else {
        this.issueMasterForm.removeControl('attachment');
      }

    });
  }


  private getOicProject() {
    this.userService.getAllProject().subscribe(succes => {
      this.projectsOic = succes.body;
    }, error => {
      console.log("error");
      console.log(error);
    });
  }

  private getOtherProject() {

    this.projectUserMappingService.getAssignedProjectByUsernameAndLocationCode(this.username, this.locationCode).subscribe(success => {
      this.projectsOther = success.body;
    }, error => {

    })

  }

  onChangeProjectOic() {
    this.resetProjectModule();
    this.projectDescriptionService.getProjectModuleByProjectName(this.issueMasterForm.value.projectName).subscribe(success => {
      if (success.status === 200) {
        this.moduleList = success.body;
      } else if (success.status === 204) {
        console.log("onChangeProjectOic called No content found");
        this.resetProjectModule();

      }

    }, error => {


    })
  }

  onChangeProjectOther() {
    this.resetProjectModule();
    this.projectDescriptionService.getProjectModuleByProjectName(this.issueMasterForm.value.projectName).subscribe(success => {
      if (success.status === 200) {
        this.moduleList = success.body;
      } else if (success.status === 204) {
        console.log("onChangeProjectOther() called no content found");
        this.resetProjectModule();
      }

    }, error => {

    })

  }

  onChangeProjectModule() {
    console.log("onChangeProjectModule() called");
    this.resetProblemStatement();
    this.isOther = true;
    console.log(this.issueMasterForm.value);
    this.projectProblemStatmentService.getProjectProblemStatementByModule(this.issueMasterForm.value.projectModule.id).subscribe(success => {
      if (success.status === 200) {
        this.projectProblemStatmentList = success.body;

      }
      else if (success.status === 204) {
        this.isOther = false;

      }

    }, error => {
      this.resetProjectModule();
      console.log("onChangeProjectModule() called error");
    })
  }


  onSubmitIssueMasterForm() {

    this.isProcessing = true;

    this.preparedIssueMasterObject();

    console.log("Object  prepared received");
    console.log(this.issueMasterModel);
    this.issueMasterService.insertIssueMaster(this.issueMasterModel, this.myFiles).subscribe(success => {
      if (success.status === 201) {
        this.isProcessing = false;
        this.resetIssueMasterForm();
        this.tokenId = success.body;
        this.globalutilityService.successAlertMessage("Issue Created Successfully With Id:" + this.tokenId.tokenNumber);
      }
    }, error => {
      if(error.status ===417){
        this.isProcessing = false;
        this.globalutilityService.errorAlertMessage("Unable to create issue");
        this.resetIssueMasterForm();
      }
     })
  }

  private preparedIssueMasterObject() {
    this.issueMasterModel = new IssueMaster();
    this.issueMasterModel.setUsername(this.username);
    this.issueMasterModel.setName(this.name);
    this.issueMasterModel.setMobileNumber(this.mobileNumber);
    this.issueMasterModel.setLocationCode(this.locationCode);
    this.issueMasterModel.setLocationName(this.locationName);
    this.issueMasterModel.setOfficeType(this.officeType);
    this.issueMasterModel.setProjectName(this.issueMasterForm.value.projectName);
    this.issueMasterModel.setProjectModule(this.issueMasterForm.value.projectModule.projectModule);
    this.issueMasterModel.setDescription(this.issueMasterForm.value.description);
    this.issueMasterModel.setProblemStatement(this.issueMasterForm.value.projectProblemStatement);

  }


  deleteFieldValue(index) {
    if (this.myFiles.length <= 1) {
      this.myFiles.splice(index, 1);
      this.resetFile();
    } else {
      this.myFiles.splice(index, 1);
    }
  }



  onFileChange(event) {

    this.myFiles = [];

    const size = event.srcElement.files[0].size;

    console.log(size)

    if (size < 1000000) 
    { 
     if(event.target.files.length <=5){
           
      for (var i = 0; i < event.target.files.length; i++) {
        this.myFiles.push(event.target.files[i]);
      }
    } else{
        this.globalutilityService.errorAlertMessage("Maximum 5 File Allow to upload");
      }

    }else{
    this.globalutilityService.errorAlertMessage("File Size greater 1 Mb");
    }

  }

  resetFile() {
    this.issueMasterForm.patchValue({
      attachment: '',
    });

  }

  resetIssueMasterForm() {
    this.myFiles = [];
    this.issueMasterForm.patchValue({
      projectName: '',
      projectModule: '',
      projectProblemStatement: '',
      description: '',
      attachment: '',
      isAttachment: ''
    });

  }

  resetProjectModule() {
    this.moduleList = undefined;
    this.projectProblemStatmentList = undefined;
    this.isOther = false;
    this.issueMasterForm.patchValue({
      projectModule: '',
      projectProblemStatement: ''

    });
  }
  resetProblemStatement() {
    this.projectProblemStatmentList = undefined;
    this.isOther = false;
    this.issueMasterForm.patchValue({
      projectProblemStatement: ''

    });


  }


}
