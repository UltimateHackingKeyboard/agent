import { Component, Input } from '@angular/core';
import { UHKContributor } from '../../../../models/uhk-contributor';

@Component({
    selector: 'contributor-badge',
    templateUrl: './contributor-badge.component.html',
    styleUrls: ['./contributor-badge.component.scss']
})
export class ContributorBadgeComponent {
    @Input() contributor: UHKContributor;

    get name(): string {
        return this.contributor.login;
    }

    get avatarUrl(): string {
        return this.contributor.avatar_url;
    }

    get profileUrl(): string {
        return this.contributor.html_url;
    }
}
