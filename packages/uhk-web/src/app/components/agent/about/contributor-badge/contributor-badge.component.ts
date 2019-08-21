import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../../../store';

import { UHKContributor } from '../../../../models/uhk-contributor';

@Component({
    selector: 'contributor-badge',
    templateUrl: './contributor-badge.component.html',
    styleUrls: ['./contributor-badge.component.scss']
})
export class ContributorBadgeComponent implements AfterViewInit {
    @Input() contributor: UHKContributor;
    @ViewChild('badge', { static: false }) badge: ElementRef;

    get name(): string {
        return this.contributor.login;
    }

    get avatarUrl(): string {
        return this.contributor.avatar_url;
    }

    get profileUrl(): string {
        return this.contributor.html_url;
    }

    constructor(private store: Store<AppState>) {
    }

    ngAfterViewInit(): void {
        (this.badge.nativeElement as HTMLImageElement).src = URL.createObjectURL(this.contributor.avatar);
    }
}
