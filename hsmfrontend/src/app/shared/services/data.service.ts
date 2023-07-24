import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
    private data: any;

    constructor() {
        this.data = {};
    }

    public setData(data: any): void {
        this.data = data;
    }

    public getData(): any {
        return this.data;
    }
}