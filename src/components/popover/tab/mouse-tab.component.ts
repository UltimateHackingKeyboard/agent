import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'mouse-tab',
    template:
    `
        <div class="mouse-action">
            <ul class="nav nav-pills nav-stacked">
                <li><a>     Move    </a></li>
                <li><a>     Scroll  </a></li>
                <li><a>     Click   </a></li>
                <li><a>     Speed   </a></li>
            </ul>
        </div>
        <div class="details">
        </div>
    `,
    styles:
    [`
        :host {
            display: flex;
        }

        .mouse-action {
            flex: 1;
            border-right: 1px solid black;
        }

        .details {
            flex: 2;
        }
    `]
})
export class MouseTabComponent implements OnInit {
    constructor() { }

    ngOnInit() { }

}
