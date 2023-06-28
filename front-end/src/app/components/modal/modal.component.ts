import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  public modalOpen = true;

  /**
   * Close the modal
   * @param event - The event object
   */
  closeModal(event: Event) {
    event.preventDefault();
    this.modalOpen = false;
  }
}
