import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  public modalOpen = true;

  closeModal(event: Event) {
    event.preventDefault();
    this.modalOpen = false;
    console.log("modal",this.modalOpen)
  }
}
