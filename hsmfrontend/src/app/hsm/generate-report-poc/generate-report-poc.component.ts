import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DocumentEditorContainerComponent } from '@syncfusion/ej2-angular-documenteditor';

@Component({
  selector: 'app-generate-report-poc',
  templateUrl: './generate-report-poc.component.html',
  styleUrls: ['./generate-report-poc.component.scss']
})
export class GenerateReportPocComponent {

  isLoading: boolean = false;
  @ViewChild('documenteditor_ref') container!: DocumentEditorContainerComponent;
  
  serviceLink: string = 'https://localhost:44372/api/WordEditor/';

  fields: object = { tooltip: "category" };
  listData: { [key: string]: Object }[] = [
    {
      text: 'Full Name',
      category: 'Drag or click the field to insert.',
      htmlAttributes: { draggable: true }
    },
    {
      text: 'First Name',
      category: 'Drag or click the field to insert.',
      htmlAttributes: { draggable: true }
    },
    {
      text: 'Last Name',
      category: 'Drag or click the field to insert.',
      htmlAttributes: { draggable: true }
    },
    {
      text: 'Mobile Number',
      category: 'Drag or click the field to insert.',
      htmlAttributes: { draggable: true }
    },
    {
      text: 'Email',
      category: 'Drag or click the field to insert.',
      htmlAttributes: { draggable: true }
    },
    {
      text: 'Address',
      category: 'Drag or click the field to insert.',
      htmlAttributes: { draggable: true }
    },
    {
      text: 'City',
      category: 'Drag or click the field to insert.',
      htmlAttributes: { draggable: true }
    },
    {
      text: 'State',
      category: 'Drag or click the field to insert.',
      htmlAttributes: { draggable: true }
    },
    {
      text: 'Zip',
      category: 'Drag or click the field to insert.',
      htmlAttributes: { draggable: true }
    }
  ];

  constructor(
    private http: HttpClient
  ) { }

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
      var text = e.dataTransfer!.getData('Text').replace(/\n/g, '').replace(/\r/g, '').replace(/\r\n/g, '').replace(/ /g, '');
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
      this.http.post<any>(this.serviceLink + "MailMerge", { documentData: fileReader.result }, { headers: headers }).subscribe({
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
    this.container.resize(windowWidth, window.innerHeight);
  }

  private insertField(fieldName: string): void {
    const fileName: string = fieldName.replace(/\n/g, '').replace(/\r/g, '').replace(/\r\n/g, '');
    const fieldCode: string = 'MERGEFIELD  ' + fileName + '  \\* MERGEFORMAT ';
    this.container.documentEditor.editor.insertField(fieldCode, '«' + fieldName + '»');
    this.container.documentEditor.focusIn();
  }
}
