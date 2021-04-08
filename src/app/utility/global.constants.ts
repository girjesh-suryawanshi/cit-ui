import { Injectable } from '@angular/core';

@Injectable()
export class GlobalConstants {


    public static readonly FILE_FORMAT_PDF: string = "pdf";
    public static readonly FILE_FORMAT_XLSX: string = "xlsx";
    public static readonly FILE_FORMAT_XLS: string = "xls";
    public static readonly FILE_FORMAT_DOC: string = "doc";
    public static readonly FILE_FORMAT_DOCX: string = "docx";
    public static readonly FILE_FORMAT_JPEG: string = "jpg";
    public static readonly FILE_FORMAT_TEXT: string = "text";
    public static readonly FILE_FORMAT_HTML: string = "html";
    public static readonly FALSE : boolean = false;
    public static readonly ROLE_OIC : string = "oic";
    public static readonly ROLE_ERP_ADMIN : string = "ERP-ADMIN";
    
}
