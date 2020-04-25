import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import {
    faClock,
    faFont,
    faGripVertical,
    faHandPaper,
    faHandPointer,
    faHandRock,
    faMousePointer,
    faPen,
    faQuestionCircle,
    faSquare,
    faTrash
} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'icon',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent implements OnChanges {

    @Input() name: string;

    icon: IconDefinition;
    css: string;

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.name) {
            this.setIcon();
        }
    }

    private setIcon(): void {
        this.css = undefined;

        switch (this.name) {
            case 'clock':
                this.icon = faClock;
                break;

            case 'font':
                this.icon = faFont;
                break;

            case 'hand-paper':
                this.icon = faHandPaper;
                break;

            case 'hand-pointer':
                this.icon = faHandPointer;
                break;

            case 'hand-rock':
                this.icon = faHandRock;
                break;

            case 'option-vertical':
                this.icon = faGripVertical;
                break;

            case 'mouse-pointer':
                this.icon = faMousePointer;
                break;

            case 'pencil':
                this.icon = faPen;
                this.css = 'action--edit';
                break;

            case 'question-circle':
                this.icon = faQuestionCircle;
                break;

            case 'square':
                this.icon = faSquare;
                break;

            case 'trash':
                this.icon = faTrash;
                this.css = 'action--trash';
                break;

            default:
                this.icon = undefined;
        }
    }
}
