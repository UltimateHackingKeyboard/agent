import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserConfigFileInfo } from 'uhk-common';

/**
 * In-app replacement for the native open dialog, shown when the Linux
 * xdg-desktop-portal file chooser is unavailable. Chromium's own file chooser
 * (and therefore the renderer's <input type="file">) goes through the same
 * portal, so the only reliable picker is one that Agent draws itself.
 */
@Component({
    selector: 'user-config-file-picker',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './user-config-file-picker.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserConfigFilePickerComponent {
    @Input() folder = '';
    @Input() files: UserConfigFileInfo[] = [];

    private readonly activeModal = inject(NgbActiveModal);

    select(file: UserConfigFileInfo): void {
        this.activeModal.close(file.path);
    }

    cancel(): void {
        this.activeModal.dismiss();
    }
}
