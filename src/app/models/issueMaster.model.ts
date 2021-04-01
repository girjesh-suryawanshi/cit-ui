export class IssueMaster{
   
  public username: string;
  public name: string;
  public locationCode: string;
  public locationName: string;
  public officeType :string;
  public projectName: string;
  public projectModule: string;
  public problemStatement: string;
  public description: string;
  public mobileNumber: string;


  setName(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;

  }

  setMobileNumber(mobileNumber: string) {
    this.mobileNumber = mobileNumber;
  }

  getMobileNumber(): string {
    return this.mobileNumber;

  }

  setProjectName(projectName:string){
    this.projectName = projectName;
  }

  getProjectName():string{
    return this.projectName;
  }

  setProjectModule(projectModule:string){
    this.projectModule = projectModule;

  }

  setProblemStatement(problemStatement:string){
     this.problemStatement = problemStatement;
  }

  getProblemStatement():string{
    return this.problemStatement;
  }

  setDescription(description:string){
      this.description = description;
  }
  getDescription():string{
    return this.description;
  }

    setUsername(username : string){
        this.username = username;
    }

    getUsername() : string{
        return this.username
    }

    setLocationCode(locationCode : string){
      this.locationCode = locationCode;
    }

    getLocationCode() : string{
      return this.locationCode;
    }

    setLocationName(locationName:string){
      this.locationName = locationName;
    }

    getLocationName():string{
      return this.locationName;
    }

    setOfficeType(officeType:string){
      this.officeType = officeType;
    }

    getOfficeType():string{
      return this.officeType;
    }


}