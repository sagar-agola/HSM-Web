import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentEditorContainerComponent } from '@syncfusion/ej2-angular-documenteditor';
import { SelectedEventArgs, UploaderComponent } from '@syncfusion/ej2-angular-inputs';
import { DialogComponent, PositionDataModel } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2-base';

@Component({
  selector: 'app-assettaskgroupstrategyhsmreport',
  templateUrl: './assettaskgroupstrategyhsmreport.component.html',
  styleUrls: ['./assettaskgroupstrategyhsmreport.component.scss']
})
export class AssetTaskGroupStrategyHsmReportComponent implements OnInit, AfterViewInit {

  isLoading: boolean = false;
  @ViewChild('documenteditor_ref') container!: DocumentEditorContainerComponent;
  @ViewChild('defaultupload') uploadObj!: UploaderComponent;

  @ViewChild('dialogTemplate') dialogTemplate: DialogComponent | any;
  @ViewChild('dialogRootContainer', { read: ElementRef }) dialogRootContainer: ElementRef | any;
  // The Dialog shows within the target element.
  public dialogTargetElement?: HTMLElement;

  serviceLink: string = 'https://localhost:44372/api/WordEditor/';

  id: number = 0;
  hierarchyId: number = 0;
  fields: object = { tooltip: "category" };
  listData: { [key: string]: Object }[] = [
    {
      text: 'Task Group Description',
      category: 'Drag or click the field to insert.',
      htmlAttributes: { draggable: true }
    },
    {
      text: 'Class Name',
      category: 'Drag or click the field to insert.',
      htmlAttributes: { draggable: true }
    },
    {
      text: 'Asset Manufacturer',
      category: 'Drag or click the field to insert.',
      htmlAttributes: { draggable: true }
    },
    {
      text: 'Specification',
      category: 'Drag or click the field to insert.',
      htmlAttributes: { draggable: true }
    },
    {
      text: 'Category Name',
      category: 'Drag or click the field to insert.',
      htmlAttributes: { draggable: true }
    },
    {
      text: 'Task Description',
      category: 'Drag or click the field to insert.',
      htmlAttributes: { draggable: true }
    },
    {
      text: 'Corrective Actions',
      category: 'Drag or click the field to insert.',
      htmlAttributes: { draggable: true }
    },
    {
      text: 'Acceptable Limits',
      category: 'Drag or click the field to insert.',
      htmlAttributes: { draggable: true }
    },
  ];

  isTemplatesLoading: boolean = false;
  templateFields: Object = { text: 'title', id: 'id' };
  templates: any[] = [];

  dialogPosition: PositionDataModel = {
    X: "center",
    Y: "top"
  };

  uploaderPaths = {
    saveUrl: this.serviceLink + "UploadTemplate"
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.hierarchyId = params.hierarchyId;
    });

    this.getWordTemplates();
  }

  ngAfterViewInit(): void {
    this.dialogTargetElement = this.dialogRootContainer.nativeElement.parentElement;
    this.uploadObj.on("onFileUpload", (event: any) => console.log(event));
  }

  onTemplateSelect(event: any): void {
    this.container.documentEditor.open(event.data.content);
    this.dialogTemplate.hide();
  }

  onFileUploading(args: any): EmitType<SelectedEventArgs> {
    args.customFormData = [{ 'UserId': localStorage.getItem("loggUserId") }];
    return args;
  }

  onCreate(): void {
    this.updateDocumentEditorSize();

    document.getElementById("listview")!.addEventListener("dragstart", function (event) {
      event.dataTransfer!.setData("Text", (event.target as any).innerText);
      (event.target as any).classList.add('de-drag-target');
    });

    // Prevent default drag over for document editor element
    this.container.documentEditor.element.addEventListener("dragover", function (event) {
      event.preventDefault();
    });

    // Drop Event for document editor element
    this.container.documentEditor.element.addEventListener("drop", (e) => {
      var text = e.dataTransfer!.getData('Text');
      this.container.documentEditor.selection.select({ x: e.offsetX, y: e.offsetY, extend: false });
      this.insertField(text);
    });

    document.addEventListener("dragend", (event) => {
      if ((event.target as any).classList.contains('de-drag-target')) {
        (event.target as any).classList.remove('de-drag-target');
      }
    });
  }

  onFieldSelect(args: any): void {
    let fieldName: any = args.item.textContent;
    this.insertField(fieldName);
  }

  getWordTemplates(): void {
    this.isTemplatesLoading = true;
    this.http.get<any[]>(`${this.serviceLink}GetTemplates/${localStorage.getItem("loggUserId")}`).subscribe({
      next: (templates: any[]) => {
        this.templates = templates;
      },
      complete: () => this.isTemplatesLoading = false
    });
  }

  download(): void {
    this.container.documentEditor.save("report.docx", 'Docx');
  }

  mailMergeDocument(): void {
    this.container.documentEditor.saveAsBlob('Docx').then((exportedDocument) => this.mailMergeBlob(exportedDocument));
  }

  private mailMergeBlob(blob: Blob): void {
    var fileReader = new FileReader();

    fileReader.onload = () => {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append("Content-Type", "application/json;charset=UTF-8");

      this.isLoading = true;
      this.http.post<any>(`${this.serviceLink}MailMerge/${this.id}/${this.hierarchyId}`, { documentData: fileReader.result }, { headers: headers }).subscribe({
        next: (data) => {
          this.container.documentEditor.open(data);
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    };

    fileReader.readAsDataURL(blob);
  }

  private updateDocumentEditorSize(): void {
    var windowWidth = window.innerWidth - document.getElementById('fields-div')!.offsetWidth - document.getElementById('sidebar')!.offsetWidth;
    this.container.resize(windowWidth - 50, window.innerHeight - 50);
  }

  private insertField(fieldName: string): void {
    const fileName: string = fieldName.replace(/ /g, '').replace(/\n/g, '').replace(/\r/g, '').replace(/\r\n/g, '');
    const fieldCode: string = 'MERGEFIELD  ' + fileName + '  \\* MERGEFORMAT ';
    this.container.documentEditor.editor.insertField(fieldCode, '«' + fieldName + '»');
    this.container.documentEditor.focusIn();
  }

}
