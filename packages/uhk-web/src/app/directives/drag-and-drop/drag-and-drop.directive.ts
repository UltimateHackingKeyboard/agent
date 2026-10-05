import { Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';

const DATA_INDEX_ATTRIBUTE = 'data-index';
const DRAG_THRESHOLD = 3;
const MIRROR_CLASS = 'gu-mirror';
const TRANSIT_CLASS = 'gu-transit';
const UNSELECTABLE_CLASS = 'gu-unselectable';

/**
 * Reorders the items of a list by dragging them with the pointer.
 *
 * The directive is attached to the container of the sortable items. Every
 * sortable item must expose its index within the bound model in a
 * `data-index` attribute. Items without a `data-index` attribute (for example
 * a temporary "new item" placeholder) are ignored by the reordering.
 */
@Directive({
    selector: '[dragAndDrop]',
    standalone: false,
})
export class DragAndDropDirective implements OnDestroy {
    /** The model that is reordered while dragging. */
    @Input('dragAndDrop') model: readonly unknown[] = [];
    /** Optional CSS selector of the element that starts a drag. */
    @Input() dragAndDropHandle: string;
    /** Emits the reordered model when a drag finishes on a new position. */
    @Output() dragAndDropChange = new EventEmitter<readonly unknown[]>();

    private grabbed = false;
    private dragging = false;
    private item: HTMLElement;
    private mirror: HTMLElement;
    private pointerId = -1;
    private offsetX = 0;
    private offsetY = 0;
    private startX = 0;
    private startY = 0;
    private initialRect: DOMRect;

    constructor(private readonly elementRef: ElementRef<HTMLElement>) {
    }

    @HostListener('pointerdown', ['$event'])
    onPointerDown(event: PointerEvent): void {
        if (this.grabbed || event.button !== 0) {
            return;
        }

        const item = this.getDirectChild(event.target);
        if (!item || this.getModelIndex(item) === undefined) {
            return;
        }

        const target = event.target instanceof Element ? event.target : undefined;
        if (this.dragAndDropHandle && (!target || !this.isHandleEvent(target, item))) {
            return;
        }

        event.preventDefault();

        const rect = item.getBoundingClientRect();

        this.grabbed = true;
        this.item = item;
        this.pointerId = event.pointerId;
        this.startX = event.clientX;
        this.startY = event.clientY;
        this.offsetX = event.clientX - rect.left;
        this.offsetY = event.clientY - rect.top;
        this.initialRect = rect;

        window.addEventListener('pointermove', this.onPointerMove);
        window.addEventListener('pointerup', this.onPointerUp);
        window.addEventListener('pointercancel', this.onPointerUp);
    }

    ngOnDestroy(): void {
        this.cleanup();
    }

    private onPointerMove = (event: PointerEvent): void => {
        if (!this.grabbed || event.pointerId !== this.pointerId) {
            return;
        }

        if (!this.dragging) {
            if (Math.abs(event.clientX - this.startX) < DRAG_THRESHOLD
                && Math.abs(event.clientY - this.startY) < DRAG_THRESHOLD) {
                return;
            }

            this.beginDrag();
        }

        this.moveMirror(event);

        if (!this.isOverContainer(event)) {
            return;
        }

        const reference = this.getReference(event.clientY);
        if (reference !== this.item) {
            this.elementRef.nativeElement.insertBefore(this.item, reference);
        }
    };

    private onPointerUp = (event: PointerEvent): void => {
        if (!this.grabbed || event.pointerId !== this.pointerId) {
            return;
        }

        const reordered = this.dragging ? this.getReorderedModel() : undefined;
        this.cleanup();

        if (reordered) {
            this.dragAndDropChange.emit(reordered);
        }
    };

    private beginDrag(): void {
        this.dragging = true;
        this.item.classList.add(TRANSIT_CLASS);
        document.body.classList.add(UNSELECTABLE_CLASS);

        this.mirror = this.item.cloneNode(true) as HTMLElement;
        this.mirror.classList.remove(TRANSIT_CLASS);
        this.mirror.classList.add(MIRROR_CLASS);
        this.mirror.style.width = `${this.initialRect.width}px`;
        this.mirror.style.height = `${this.initialRect.height}px`;
        this.mirror.style.left = `${this.initialRect.left}px`;
        this.mirror.style.top = `${this.initialRect.top}px`;
        this.mirror.style.pointerEvents = 'none';
        document.body.appendChild(this.mirror);
    }

    private moveMirror(event: PointerEvent): void {
        if (!this.mirror) {
            return;
        }

        this.mirror.style.left = `${event.clientX - this.offsetX}px`;
        this.mirror.style.top = `${event.clientY - this.offsetY}px`;
    }

    private isOverContainer(event: PointerEvent): boolean {
        const target = document.elementFromPoint(event.clientX, event.clientY);

        return !!target && this.elementRef.nativeElement.contains(target);
    }

    private getReference(clientY: number): Node | null {
        const children = Array.from(this.elementRef.nativeElement.children) as HTMLElement[];
        let foreign: HTMLElement;

        for (const child of children) {
            if (child === this.item) {
                continue;
            }

            if (this.getModelIndex(child) === undefined) {
                foreign = foreign ?? child;
                continue;
            }

            const rect = child.getBoundingClientRect();
            if (clientY < rect.top + rect.height / 2) {
                return child;
            }
        }

        // Insert the sortable items before non-sortable placeholders such as the "new item" row.
        return foreign ?? null;
    }

    private getReorderedModel(): readonly unknown[] | undefined {
        const model = this.model ?? [];
        const orderedIndices: number[] = [];

        for (const child of Array.from(this.elementRef.nativeElement.children) as HTMLElement[]) {
            const index = this.getModelIndex(child);
            if (index !== undefined && index < model.length) {
                orderedIndices.push(index);
            }
        }

        const listed = new Set(orderedIndices);
        const reordered: unknown[] = orderedIndices.map(index => model[index]);

        // Keep the items that are not rendered (for example the trailing empty host connections).
        model.forEach((item, index) => {
            if (!listed.has(index)) {
                reordered.push(item);
            }
        });

        if (reordered.length !== model.length) {
            return undefined;
        }

        const changed = reordered.some((item, index) => item !== model[index]);

        return changed ? reordered : undefined;
    }

    private getDirectChild(target: EventTarget): HTMLElement | undefined {
        const container = this.elementRef.nativeElement;
        let node = target as Node;
        if (node.nodeType === Node.TEXT_NODE) {
            node = node.parentNode;
        }

        while (node && node.parentNode !== container) {
            node = node.parentNode;
        }

        return node && node !== container ? node as HTMLElement : undefined;
    }

    private isHandleEvent(target: Element, item: HTMLElement): boolean {
        const handle = target.closest(this.dragAndDropHandle);

        return !!handle && item.contains(handle);
    }

    private getModelIndex(element: HTMLElement): number | undefined {
        const value = element.getAttribute(DATA_INDEX_ATTRIBUTE);
        if (value === null) {
            return undefined;
        }

        const index = Number.parseInt(value, 10);

        return Number.isNaN(index) ? undefined : index;
    }

    private cleanup(): void {
        window.removeEventListener('pointermove', this.onPointerMove);
        window.removeEventListener('pointerup', this.onPointerUp);
        window.removeEventListener('pointercancel', this.onPointerUp);

        this.item?.classList.remove(TRANSIT_CLASS);
        document.body.classList.remove(UNSELECTABLE_CLASS);
        this.mirror?.remove();

        this.grabbed = false;
        this.dragging = false;
        this.item = undefined;
        this.mirror = undefined;
        this.pointerId = -1;
        this.initialRect = undefined;
    }
}