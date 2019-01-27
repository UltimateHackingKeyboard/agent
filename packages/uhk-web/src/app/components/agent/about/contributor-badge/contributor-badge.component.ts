import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../../../store/index';
import { OpenUrlInNewWindowAction } from '../../../../store/actions/app';

import { UHKContributor } from '../../../../models/uhk-contributor';

@Component({
    selector: 'contributor-badge',
    templateUrl: './contributor-badge.component.html',
    styleUrls: ['./contributor-badge.component.scss']
})
export class ContributorBadgeComponent implements OnInit {
    @Input() contributor: UHKContributor;
    @ViewChild('badge') badge: ElementRef;

    get name(): string {
        return this.contributor.login;
    }

    get avatarUrl(): string {
        return this.contributor.avatar_url;
    }

    get profileUrl(): string {
        return this.contributor.html_url;
    }

    constructor(private store: Store<AppState>) {}

    ngOnInit(): void {
        (this.badge.nativeElement as HTMLImageElement).src = URL.createObjectURL(this.contributor.avatar);
    }

    openUrlInBrowser(event: Event): void {
        event.preventDefault();

        this.store.dispatch(new OpenUrlInNewWindowAction((event.target as Element).getAttribute('href')));
    }
}
