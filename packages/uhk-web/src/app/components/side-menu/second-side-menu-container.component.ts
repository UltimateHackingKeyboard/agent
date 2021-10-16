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
    template: '<template #secondaryContainer></template>'
}))
export class SecondSideMenuContainerComponent {
    @ViewChild('secondaryContainer', { read: ViewContainerRef }) container;

    constructor(private componentFactoryResolver: ComponentFactoryResolver,
                private cdRef: ChangeDetectorRef) { }

    resolveComponent(component: any): void {
        this.container.clear();
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        this.container.createComponent(componentFactory);
        this.cdRef.detectChanges();
    }

    clear(): void {
        this.container.clear();
    }
}
