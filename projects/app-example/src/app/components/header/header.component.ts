import { Component, OnInit, Input } from '@angular/core';
import { BreakpointService } from  '../../master-detail/public-api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public defaultTitle = 'No title';

  @Input() title = this.defaultTitle;
  @Input() showBack = false;
  @Input() backRoute = '../../';

  constructor(public breakpointService: BreakpointService) { }

  ngOnInit() { }

}
