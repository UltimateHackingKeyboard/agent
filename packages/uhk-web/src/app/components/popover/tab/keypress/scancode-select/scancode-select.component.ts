import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
    inject,
} from '@angular/core';
import { ConnectedPosition } from '@angular/cdk/overlay';

export interface ScancodeSelectOption {
    id: string;
    text: string;
    group?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    additional?: any;
}

export interface ScancodeSelectGroup {
    name: string;
    options: ScancodeSelectOption[];
    /**
     * Explicit tile rows (Numpad). When empty, tiled groups use a wrapping grid
     * over `options` instead.
     */
    tileRows: ScancodeSelectOption[][];
    tiled: boolean;
}

/** Categories with short labels that render as a compact tile grid. */
const TILED_GROUPS = new Set([
    'Function',
    'Letter',
    'Number',
    'Numpad',
    'Punctuation',
    'Whitespace',
]);

/** Numpad display rows, in order. */
const NUMPAD_TILE_ROWS = [
    ['0', '1', '2', '3', '4'],
    ['5', '6', '7', '8', '9'],
    ['/', '*', '-', '+', '.'],
    ['Enter', 'NumLock'],
];

const MAX_HEIGHT_OFFSET = 20;
const SEARCH_BAR_HEIGHT = 44;

@Component({
    selector: 'scancode-select',
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './scancode-select.component.html',
    styleUrls: ['./scancode-select.component.scss'],
})
export class ScancodeSelectComponent implements OnChanges {
    @Input() items: ScancodeSelectOption[] = [];
    @Input() selectedId = '';
    @Input() searchFn: ((term: string, item: ScancodeSelectOption) => boolean) | null = null;
    @Input() addTag: ((term: string) => ScancodeSelectOption | boolean) | null = null;
    @Input() addTagText: ((term: string) => string) | null = null;

    @Output() selectedIdChange = new EventEmitter<string>();

    @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

    isOpen = false;
    inputValue = '';
    searchTerm = '';
    markedIndex = 0;
    panelMaxHeight = 240;
    ungroupedOptions: ScancodeSelectOption[] = [];
    groups: ScancodeSelectGroup[] = [];
    tagLabel = '';
    readonly overlayPositions: ConnectedPosition[] = [
        {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
            offsetY: 2,
        },
        {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
            offsetY: -2,
        },
    ];

    private readonly cdRef = inject(ChangeDetectorRef);
    private readonly host = inject(ElementRef<HTMLElement>);

    get selectedOption(): ScancodeSelectOption | undefined {
        return this.items.find(item => item.id === this.selectedId);
    }

    get displayText(): string {
        return this.selectedOption?.text ?? '';
    }

    get flatOptions(): ScancodeSelectOption[] {
        return [
            ...this.ungroupedOptions,
            ...this.groups.flatMap(group => group.options),
        ];
    }

    get showTag(): boolean {
        return !!this.tagLabel;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.items || changes.selectedId) {
            this.rebuildFilteredView();
        }
    }

    open(): void {
        if (this.isOpen) {
            return;
        }

        this.isOpen = true;
        // Show every category on open; filtering starts when the user types.
        this.inputValue = this.displayText;
        this.searchTerm = '';
        this.rebuildFilteredView();
        this.markSelectedOption();
        this.updatePanelMaxHeight();
        this.cdRef.markForCheck();

        setTimeout(() => {
            const input = this.searchInput?.nativeElement;
            if (input) {
                input.focus();
                input.select();
            }
        });
    }

    close(): void {
        if (!this.isOpen) {
            return;
        }

        this.isOpen = false;
        this.inputValue = '';
        this.searchTerm = '';
        this.rebuildFilteredView();
        this.cdRef.markForCheck();
    }

    toggle(): void {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    onSearchInput(value: string): void {
        this.inputValue = value;
        this.searchTerm = value;
        this.markedIndex = 0;
        this.rebuildFilteredView();
        this.cdRef.markForCheck();
    }

    onOptionMouseEnter(option: ScancodeSelectOption): void {
        const index = this.flatOptions.findIndex(item => item.id === option.id);
        if (index >= 0) {
            this.markedIndex = index;
        }
    }

    onTagMouseEnter(): void {
        this.markedIndex = this.flatOptions.length;
    }

    isMarked(option: ScancodeSelectOption): boolean {
        return this.flatOptions[this.markedIndex]?.id === option.id;
    }

    isTagMarked(): boolean {
        return this.showTag && this.markedIndex === this.flatOptions.length;
    }

    selectOption(option: ScancodeSelectOption): void {
        this.selectedIdChange.emit(option.id);
        this.close();
    }

    selectTag(): void {
        if (!this.addTag || !this.searchTerm) {
            return;
        }

        const result = this.addTag(this.searchTerm);
        if (result && typeof result !== 'boolean') {
            this.selectedIdChange.emit(result.id);
        }
        this.close();
    }

    onControlMouseDown(event: MouseEvent): void {
        // Keep focus handling in this component; avoid input blur before toggle.
        event.preventDefault();
        this.toggle();
        if (this.isOpen) {
            setTimeout(() => {
                this.searchInput?.nativeElement.focus();
                this.searchInput?.nativeElement.select();
            });
        }
    }

    @HostListener('document:keydown', ['$event'])
    onDocumentKeyDown(event: KeyboardEvent): void {
        if (!this.isOpen || event.key !== 'Escape') {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        this.close();
    }

    onKeyDown(event: KeyboardEvent): void {
        if (!this.isOpen) {
            if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.open();
            }
            return;
        }

        const navigableCount = this.flatOptions.length + (this.showTag ? 1 : 0);

        switch (event.key) {
            case 'Escape':
                event.preventDefault();
                event.stopPropagation();
                this.close();
                break;
            case 'ArrowDown':
                event.preventDefault();
                if (navigableCount > 0) {
                    this.markedIndex = (this.markedIndex + 1) % navigableCount;
                    this.scrollMarkedOptionIntoView();
                }
                break;
            case 'ArrowUp':
                event.preventDefault();
                if (navigableCount > 0) {
                    this.markedIndex = (this.markedIndex - 1 + navigableCount) % navigableCount;
                    this.scrollMarkedOptionIntoView();
                }
                break;
            case 'Enter':
                event.preventDefault();
                if (this.isTagMarked()) {
                    this.selectTag();
                } else if (this.flatOptions[this.markedIndex]) {
                    this.selectOption(this.flatOptions[this.markedIndex]);
                }
                break;
            case 'Tab':
                this.close();
                break;
            default:
                break;
        }

        this.cdRef.markForCheck();
    }

    private rebuildFilteredView(): void {
        const term = this.searchTerm.trim();
        const ungroupedOptions: ScancodeSelectOption[] = [];
        const groups: ScancodeSelectGroup[] = [];
        const groupIndex = new Map<string, number>();

        for (const item of this.items) {
            if (term && !this.matches(term, item)) {
                continue;
            }

            if (!item.group) {
                ungroupedOptions.push(item);
                continue;
            }

            let index = groupIndex.get(item.group);
            if (index === undefined) {
                index = groups.length;
                groupIndex.set(item.group, index);
                groups.push({
                    name: item.group,
                    options: [],
                    tileRows: [],
                    tiled: TILED_GROUPS.has(item.group),
                });
            }
            groups[index].options.push(item);
        }

        for (const group of groups) {
            if (group.name === 'Numpad') {
                this.applyNumpadTileRows(group);
            }
        }

        this.ungroupedOptions = ungroupedOptions;
        this.groups = groups;
        this.tagLabel = term && this.addTagText ? this.addTagText(term) : '';

        const navigableCount = this.flatOptions.length + (this.showTag ? 1 : 0);
        if (this.markedIndex >= navigableCount) {
            this.markedIndex = Math.max(0, navigableCount - 1);
        }
    }

    private applyNumpadTileRows(group: ScancodeSelectGroup): void {
        const byText = new Map(group.options.map(option => [option.text, option]));
        const tileRows: ScancodeSelectOption[][] = [];

        for (const rowTexts of NUMPAD_TILE_ROWS) {
            const row = rowTexts
                .map(text => byText.get(text))
                .filter((option): option is ScancodeSelectOption => !!option);
            if (row.length > 0) {
                tileRows.push(row);
            }
        }

        group.tileRows = tileRows;
        // Keep keyboard navigation order aligned with the visual layout.
        if (tileRows.length > 0) {
            group.options = tileRows.flat();
        }
    }

    private matches(term: string, item: ScancodeSelectOption): boolean {
        if (this.searchFn) {
            return this.searchFn(term, item);
        }

        return item.text.toLowerCase().includes(term.toLowerCase());
    }

    private markSelectedOption(): void {
        const selectedIndex = this.flatOptions.findIndex(item => item.id === this.selectedId);
        this.markedIndex = selectedIndex >= 0 ? selectedIndex : 0;
    }

    private updatePanelMaxHeight(): void {
        const triggerRect = this.host.nativeElement.getBoundingClientRect();
        const spaceBelow = window.document.body.clientHeight - triggerRect.bottom - MAX_HEIGHT_OFFSET;
        const spaceAbove = triggerRect.top - MAX_HEIGHT_OFFSET;
        // Prefer the side with more room so a tall panel is less likely to be
        // pushed back over the trigger (especially in the macro editor).
        this.panelMaxHeight = Math.max(120, Math.max(spaceBelow, spaceAbove) - SEARCH_BAR_HEIGHT);
    }

    private scrollMarkedOptionIntoView(): void {
        setTimeout(() => {
            document.querySelector('.scancode-select__option--marked')
                ?.scrollIntoView({ block: 'nearest' });
        });
    }
}
