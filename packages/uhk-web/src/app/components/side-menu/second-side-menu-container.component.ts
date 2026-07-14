import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ViewChild,
    ViewContainerRef
} from '@angular/core';

@Component(({
    selector: 'second-side-menu-container',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
    template: '<template #secondaryContainer></template>'
}))
export class SecondSideMenuContainerComponent {
    @ViewChild('secondaryContainer', { read: ViewContainerRef }) container;

    constructor(private componentFactoryResolver: ComponentFactoryResolver,
                private cdRef: ChangeDetectorRef) { }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolveComponent(component: any): void {
        this.container.clear();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        this.container.createComponent(componentFactory);
        this.cdRef.detectChanges();
    }

    clear(): void {
        this.container.clear();
    }
}
