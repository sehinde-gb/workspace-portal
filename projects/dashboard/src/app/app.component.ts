import { Component } from '@angular/core';
import { PageHeaderComponent, InfoCardComponent } from 'shared-ui';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PageHeaderComponent, InfoCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dashboard';
}
