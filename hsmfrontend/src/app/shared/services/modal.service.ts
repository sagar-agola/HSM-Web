import { Injectable } from '@angular/core';
import { Subject ,  BehaviorSubject } from 'rxjs';

@Injectable()
export class ModalService {
    private activeModalSource = new BehaviorSubject<any>('');

    activeModal$ = this.activeModalSource.asObservable();

    setCurrentModal(modal: string) {
        this.activeModalSource.next(modal);
    }

    setCurrentModalWithArgs(modalName: string, args: any) {
        var modalObject = {
            name: modalName,
            args: args
        }
        this.activeModalSource.next(modalObject);
    }

    closeModal() {
        setTimeout(() => this.activeModalSource.next(''));
    }
}