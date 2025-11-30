import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent, FooterComponent } from '@staretz/shared-ui';

@Component({
  imports: [RouterModule, HeaderComponent, FooterComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'host';
}
