import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { LogService } from 'uhk-common';

@Injectable({
    providedIn: 'root'
})
export class KeyboardSvgExportService {
    constructor(@Inject(DOCUMENT) private document: Document,
                private logService: LogService) {
    }

    public downloadSvgKeyboard(): void {
        this.logService.misc('[KeyboardSvgExportService] start to export.');
        const svgKeyboard = this.document.querySelector('svg-keyboard[isKeyboardVisible="true"] > svg');

        if (!svgKeyboard) {
            this.logService.misc('[KeyboardSvgExportService] svg-keyboard element not found.');
            return;
        }

        this.logService.misc('[KeyboardSvgExportService] clone svg-keyboard element.')
        const clonedSvgKeyboard = svgKeyboard.cloneNode(true) as SVGElement;

        this.logService.misc('[KeyboardSvgExportService] apply inline style.');
        this.inlineStyles(svgKeyboard, clonedSvgKeyboard);

        this.logService.misc('[KeyboardSvgExportService] remove angular specific attributes.');
        this.removeAngularAttributes(clonedSvgKeyboard);

        this.logService.misc('[KeyboardSvgExportService] remove comments.');
        this.removeComments(clonedSvgKeyboard);

        this.logService.misc('[KeyboardSvgExportService] convert custom elements to svg group.');
        this.convertCustomElementsToGroups(clonedSvgKeyboard);

        this.logService.misc('[KeyboardSvgExportService] optimize styles.');
        this.optimizeStyles(clonedSvgKeyboard);

        this.logService.misc('[KeyboardSvgExportService] clean up inline styles.');
        this.cleanupInlineStyles(clonedSvgKeyboard);

        this.logService.misc('[KeyboardSvgExportService] clean up class attributes.');
        this.cleanupClassAttributes(clonedSvgKeyboard);

        this.logService.misc('[KeyboardSvgExportService] generate svg document.');
        const svgString = this.getSvgString(clonedSvgKeyboard);

        this.logService.misc('[KeyboardSvgExportService] download svg document.');
        this.downloadSvg(svgString);
        this.logService.misc('[KeyboardSvgExportService] done.');
    }

    /**
     * Inline all computed CSS styles from the original element to the cloned element
     */
    private inlineStyles(originalElement: Element, clonedElement: Element): void {
        const originalChildren = originalElement.children;
        const clonedChildren = clonedElement.children;

        const computedStyle = window.getComputedStyle(originalElement);

        this.applyComputedStyles(clonedElement as HTMLElement | SVGElement, computedStyle);

        for (let i = 0; i < originalChildren.length; i++) {
            this.inlineStyles(originalChildren[i], clonedChildren[i]);
        }
    }

    /**
     * Apply computed styles to an element
     */
    private applyComputedStyles(element: HTMLElement | SVGElement, computedStyle: CSSStyleDeclaration): void {
        // List of CSS properties relevant to SVG rendering
        const svgStyleProperties = [
            'fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-dashoffset',
            'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity',
            'fill-opacity', 'opacity', 'font-family', 'font-size', 'font-weight',
            'font-style', 'text-anchor', 'dominant-baseline', 'alignment-baseline',
            'transform', 'transform-origin', 'display', 'visibility', 'clip-path',
            'mask', 'filter', 'marker-start', 'marker-mid', 'marker-end',
            'color', 'stop-color', 'stop-opacity', 'flood-color', 'flood-opacity',
            'lighting-color'
        ];

        let styleString = '';

        for (const prop of svgStyleProperties) {
            const value = computedStyle.getPropertyValue(prop);

            // Only add non-empty values that aren't default/initial
            if (prop !== 'font-family' && value && value !== 'none' && value !== 'normal' && value !== 'auto') {
                styleString += `${prop}:${value};`;
            }
        }

        if (styleString) {
            element.setAttribute('style', styleString);
        }
    }

    /**
     * Optimize styles by extracting common style attributes to a <style> element
     */
    private optimizeStyles(svgElement: SVGElement): void {
        const styleMap = new Map<string, Element[]>(); // style -> elements with that style
        const elements: Element[] = [];

        // Collect all elements with style attributes
        this.collectElementsWithStyles(svgElement, elements);

        // Group elements by their style
        for (const el of elements) {
            const style = el.getAttribute('style');
            if (style) {
                if (!styleMap.has(style)) {
                    styleMap.set(style, []);
                }
                styleMap.get(style)!.push(el);
            }
        }

        // Find styles that appear multiple times (worth extracting)
        const commonStyles = Array.from(styleMap.entries())
            .filter(([_, els]) => els.length > 1) // Only extract if used 2+ times
            .sort((a, b) => b[1].length - a[1].length); // Sort by frequency

        if (commonStyles.length === 0) {
            return; // No optimization needed
        }

        const optimizedCss = this.optimizeCssRules(commonStyles);

        const defsElement = svgElement.querySelector('defs') ||
            this.document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const styleElement = this.document.createElementNS('http://www.w3.org/2000/svg', 'style');
        styleElement.setAttribute('type', 'text/css');

        styleElement.textContent = '\n' + optimizedCss.css;

        // Apply classes to elements
        for (const [originalStyle, className] of optimizedCss.styleToClass.entries()) {
            const els = styleMap.get(originalStyle);
            if (els) {
                for (const el of els) {
                    el.removeAttribute('style');
                    const existingClass = el.getAttribute('class');
                    const classes = className.split(' ').filter(c => c);
                    const newClass = existingClass
                        ? `${existingClass} ${classes.join(' ')}`
                        : classes.join(' ');
                    el.setAttribute('class', newClass);
                }
            }
        }

        // Insert style element at the beginning of defs
        if (!svgElement.querySelector('defs')) {
            defsElement.appendChild(styleElement);
            svgElement.insertBefore(defsElement, svgElement.firstChild);
        } else {
            defsElement.insertBefore(styleElement, defsElement.firstChild);
        }
    }

    /**
     * Optimize CSS rules by removing redundant properties and extracting common ones
     */
    private optimizeCssRules(commonStyles: [string, Element[]][]): { css: string, styleToClass: Map<string, string> } {
        const parsedStyles: Array<{ original: string, props: Map<string, string>, elements: Element[] }> = [];

        for (const [styleStr, els] of commonStyles) {
            const props = this.parseStyleString(styleStr);
            parsedStyles.push({ original: styleStr, props, elements: els });
        }

        // Find properties that have the SAME value across ALL styles
        const allProps = new Map<string, Map<string, number>>(); // prop -> (normalized value -> count)

        for (const style of parsedStyles) {
            for (const [prop, value] of style.props.entries()) {
                if (!allProps.has(prop)) {
                    allProps.set(prop, new Map());
                }
                const normalizedValue = this.normalizePropertyValue(prop, value);
                const counts = allProps.get(prop)!;
                counts.set(normalizedValue, (counts.get(normalizedValue) || 0) + 1);
            }
        }

        // Properties that appear in every style with the same normalized value can be extracted to base class
        const baseClassProps = new Map<string, string>();

        for (const [prop, valueCounts] of allProps.entries()) {
            // If this property appears in all styles with the same value
            if (valueCounts.size === 1 && Array.from(valueCounts.values())[0] === parsedStyles.length) {
                const normalizedValue = Array.from(valueCounts.keys())[0];
                baseClassProps.set(prop, normalizedValue);
            }
        }

        // Remove base class properties from individual styles
        if (baseClassProps.size > 0) {
            for (const style of parsedStyles) {
                for (const [prop, baseValue] of baseClassProps.entries()) {
                    const styleValue = style.props.get(prop);
                    if (styleValue && this.normalizePropertyValue(prop, styleValue) === baseValue) {
                        style.props.delete(prop);
                    }
                }
            }
        }

        const sharedClasses = this.findSharedPropertyPatterns(parsedStyles, baseClassProps);

        let css = '';
        const styleToClass = new Map<string, string>();
        let classCounter = 1;

        // Add base class if we have common properties
        if (baseClassProps.size > 0) {
            css += '.st-base { ';
            css += 'font-family: Helvetica;';
            for (const [prop, value] of baseClassProps.entries()) {
                css += `${prop}:${value};`;
            }
            css += ' }\n';
        }

        // Add shared classes for common patterns
        const sharedClassNames = new Map<string, string>();
        for (const [pattern, props] of sharedClasses.entries()) {
            const sharedClassName = `st-common${classCounter++}`;
            css += `.${sharedClassName} { `;
            for (const [prop, value] of props.entries()) {
                css += `${prop}:${value};`;
            }
            css += ' }\n';
            sharedClassNames.set(pattern, sharedClassName);
        }

        // Generate individual style classes
        for (const style of parsedStyles) {
            let usedSharedClass = '';
            for (const [pattern, className] of sharedClassNames.entries()) {
                const patternProps = sharedClasses.get(pattern)!;
                let matches = true;
                for (const [prop, value] of patternProps.entries()) {
                    if (style.props.get(prop) !== value) {
                        matches = false;
                        break;
                    }
                }
                if (matches) {
                    usedSharedClass = className;
                    for (const prop of patternProps.keys()) {
                        style.props.delete(prop);
                    }
                    break;
                }
            }

            if (style.props.size === 0) {
                const classes = [baseClassProps.size > 0 ? 'st-base' : '', usedSharedClass].filter(c => c);
                styleToClass.set(style.original, classes.join(' '));
            } else {
                const className = `st${classCounter++}`;
                css += `.${className} { `;

                for (const [prop, value] of style.props.entries()) {
                    css += `${prop}:${value};`;
                }

                css += ' }\n';

                const classes = [
                    baseClassProps.size > 0 ? 'st-base' : '',
                    usedSharedClass,
                    className
                ].filter(c => c);
                styleToClass.set(style.original, classes.join(' '));
            }
        }

        return { css, styleToClass };
    }

    /**
     * Find common property patterns that appear in multiple styles
     */
    private findSharedPropertyPatterns(
        parsedStyles: Array<{ original: string, props: Map<string, string>, elements: Element[] }>,
        baseClassProps: Map<string, string>
    ): Map<string, Map<string, string>> {
        const sharedPatterns = new Map<string, Map<string, string>>();

        // Look for property combinations that appear in 3+ styles
        const propertyGroups = new Map<string, { props: Map<string, string>, count: number }>();

        for (const style of parsedStyles) {
            // Create groups of that often appear together
            const commonProps = ['stroke-width', 'font-family', 'font-size', 'text-anchor', 'display'];
            const group = new Map<string, string>();

            for (const prop of commonProps) {
                if (style.props.has(prop) && !baseClassProps.has(prop)) {
                    group.set(prop, style.props.get(prop)!);
                }
            }

            if (group.size >= 2) {
                const key = Array.from(group.entries())
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([p, v]) => `${p}:${v}`)
                    .join(';');

                if (!propertyGroups.has(key)) {
                    propertyGroups.set(key, { props: new Map(group), count: 0 });
                }
                propertyGroups.get(key)!.count++;
            }
        }

        // Keep only patterns that appear 3+ times
        for (const [key, data] of propertyGroups.entries()) {
            if (data.count >= 3) {
                sharedPatterns.set(key, data.props);
            }
        }

        return sharedPatterns;
    }

    /**
     * Normalize property values for comparison (handles quote differences, whitespace, etc.)
     */
    private normalizePropertyValue(prop: string, value: string): string {
        let normalized = value.trim();

        // Normalize font-family: convert all quotes to double quotes and normalize whitespace
        if (prop === 'font-family') {
            // Replace single quotes with double quotes
            normalized = normalized.replace(/'/g, '"');
            // Normalize whitespace around commas
            normalized = normalized.replace(/\s*,\s*/g, ', ');
            // Remove extra whitespace
            normalized = normalized.replace(/\s+/g, ' ');
        }

        // Normalize colors to consistent format if needed
        if (prop.includes('color') || prop === 'fill' || prop === 'stroke') {
            // You could add RGB/hex normalization here if needed
            normalized = normalized.toLowerCase();
        }

        return normalized;
    }

    /**
     * Determine if a font-family value is the default system font stack
     */
    private isDefaultFontFamily(value: string): boolean {
        const normalized = value.toLowerCase().replace(/['"]/g, '').replace(/\s+/g, '');
        // Check if it's the system font stack
        return normalized.includes('system-ui') && normalized.includes('segoeui');
    }

    /**
     * Simplify font-family by removing default system font stack
     */
    private simplifyFontFamily(value: string): string | null {
        if (this.isDefaultFontFamily(value)) {
            // Remove the entire system font stack - we'll use default
            return null;
        }
        // Keep custom fonts like Helvetica
        return value;
    }

    /**
     * Parse a style string into a Map of properties
     */
    private parseStyleString(styleStr: string): Map<string, string> {
        const props = new Map<string, string>();
        const parts = styleStr.split(';').map(p => p.trim()).filter(p => p);

        for (const part of parts) {
            const colonIndex = part.indexOf(':');
            if (colonIndex > 0) {
                const prop = part.substring(0, colonIndex).trim();
                let value = part.substring(colonIndex + 1).trim();

                // Simplify font-family by removing default system font stack
                if (prop === 'font-family') {
                    const simplified = this.simplifyFontFamily(value);
                    if (simplified === null) {
                        // Skip default font family entirely
                        continue;
                    }
                    value = simplified;
                }

                props.set(prop, value);
            }
        }

        return props;
    }

    /**
     * Collect all elements that have style attributes
     */
    private collectElementsWithStyles(element: Element, result: Element[]): void {
        if (element.hasAttribute('style')) {
            result.push(element);
        }

        Array.from(element.children).forEach(child => {
            this.collectElementsWithStyles(child, result);
        });
    }

    /**
     * Clean up class attributes to keep only style classes (st1, st2, etc.) and remove Angular classes
     */
    private cleanupClassAttributes(element: Element): void {
        if (element.hasAttribute('class')) {
            const classValue = element.getAttribute('class')!;

            // Keep only classes that match our style pattern (st1, st2, st3, etc.)
            const classes = classValue.split(/\s+/).filter(cls => /^st\d+$/.test(cls) || cls === 'st-base' || /^st-common\d+$/.test(cls));

            if (classes.length > 0) {
                element.setAttribute('class', classes.join(' '));
            } else {
                element.removeAttribute('class');
            }
        }

        Array.from(element.children).forEach(child => {
            this.cleanupClassAttributes(child);
        });
    }

    /**
     * Clean up inline style attributes by removing default font-family and optimizing properties
     */
    private cleanupInlineStyles(element: Element): void {
        if (element.hasAttribute('style')) {
            const styleValue = element.getAttribute('style')!;
            const props = this.parseStyleString(styleValue);

            // If all properties were removed (only default font), remove the style attribute
            if (props.size === 0) {
                element.removeAttribute('style');
            } else {
                // Rebuild the style string
                let newStyle = '';
                for (const [prop, value] of props.entries()) {
                    newStyle += `${prop}:${value};`;
                }
                element.setAttribute('style', newStyle);
            }
        }

        Array.from(element.children).forEach(child => {
            this.cleanupInlineStyles(child);
        });
    }

    /**
     * Remove Angular-specific attributes from the SVG and all descendants
     */
    private removeAngularAttributes(element: Element): void {
        const angularAttributePatterns = [
            /^_ngcontent-/,     // Angular view encapsulation
            /^_nghost-/,        // Angular host
            /^ng-/,             // Angular directives (ng-reflect, ng-star-inserted, etc.)
            /^data-ng-/,        // Alternative Angular prefix
            /^x-ng-/,           // Alternative Angular prefix
            /^bindings$/,       // Angular bindings attribute
            /^svg-.*-key$/,     // UHK custom svg directives
        ];

        // Additional attributes to remove
        const attributesToRemove = [
            // Note: We keep 'class' now since we use it for style optimization
            'oncontextmenu',    // Remove event handlers
            'onclick',
            'onmousedown',
            'onmouseup',
            'onmousemove',
            'iskeyboardvisible', // Custom Angular attributes
            'layerid',
            'moduleid',
            'svg-module',
            'original-fill-color',
        ];

        // Get all attributes
        const attributes = Array.from(element.attributes);

        for (const attr of attributes) {
            const shouldRemovePattern = angularAttributePatterns.some(pattern =>
                pattern.test(attr.name)
            );

            const shouldRemoveExact = attributesToRemove.some(name =>
                attr.name.toLowerCase() === name.toLowerCase()
            );

            if (shouldRemovePattern || shouldRemoveExact) {
                element.removeAttribute(attr.name);
            }
        }

        // Recursively process all children
        Array.from(element.children).forEach(child => {
            this.removeAngularAttributes(child);
        });
    }

    /**
     * Convert custom Angular elements to standard SVG <g> elements
     */
    private convertCustomElementsToGroups(element: Element): void {
        const customElements: Element[] = [];

        // Find all custom elements (non-standard SVG elements)
        const standardSvgElements = [
            'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline',
            'polygon', 'text', 'tspan', 'textPath', 'defs', 'clipPath', 'mask',
            'pattern', 'linearGradient', 'radialGradient', 'stop', 'use', 'symbol',
            'marker', 'image', 'foreignObject', 'switch', 'a', 'animate', 'animateTransform',
            'animateMotion', 'set', 'desc', 'title', 'metadata', 'filter', 'feBlend',
            'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix',
            'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood',
            'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage',
            'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight',
            'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence'
        ];

        // Recursively find custom elements
        this.findCustomElements(element, standardSvgElements, customElements);

        // Convert each custom element to a <g> element
        customElements.forEach(customEl => {
            const g = this.document.createElementNS('http://www.w3.org/2000/svg', 'g');

            // Copy all attributes
            Array.from(customEl.attributes).forEach(attr => {
                g.setAttribute(attr.name, attr.value);
            });

            // Move all children
            while (customEl.firstChild) {
                g.appendChild(customEl.firstChild);
            }

            // Replace the custom element with the group
            customEl.parentNode?.replaceChild(g, customEl);
        });
    }

    /**
     * Recursively find custom (non-standard SVG) elements
     */
    private findCustomElements(element: Element, standardElements: string[], result: Element[]): void {
        const tagName = element.tagName.toLowerCase();

        if (!standardElements.includes(tagName)) {
            result.push(element);
        }

        Array.from(element.children).forEach(child => {
            this.findCustomElements(child, standardElements, result);
        });
    }

    /**
     * Remove HTML comments (Angular binding comments)
     */
    private removeComments(element: Element): void {
        const comments: Node[] = [];

        // Find all comment nodes
        const walker = this.document.createTreeWalker(
            element,
            NodeFilter.SHOW_COMMENT,
            null
        );

        let node = walker.nextNode()
        while (node) {
            comments.push(node);
            node = walker.nextNode()
        }

        comments.forEach(comment => {
            comment.parentNode?.removeChild(comment);
        });
    }

    /**
     * Convert SVG element to string with proper XML declaration
     */
    private getSvgString(svgElement: SVGElement): string {
        this.cleanupXmlns(svgElement);

        // Ensure xmlns attribute is present on root
        if (!svgElement.hasAttribute('xmlns')) {
            svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        }
        if (!svgElement.hasAttribute('xmlns:xlink')) {
            svgElement.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        }

        const serializer = new XMLSerializer();
        let svgString = serializer.serializeToString(svgElement);

        svgString = this.removeRedundantXmlns(svgString);

        svgString = this.prettifySvg(svgString);

        svgString = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgString;

        return svgString;
    }

    /**
     * Remove redundant xmlns attributes from nested elements
     */
    private cleanupXmlns(element: Element): void {
        // Remove xmlns from all children (keep only on root)
        Array.from(element.children).forEach(child => {
            if (child.hasAttribute('xmlns') && child !== element) {
                child.removeAttribute('xmlns');
            }
            if (child.hasAttribute('xmlns:xlink')) {
                child.removeAttribute('xmlns:xlink');
            }
            this.cleanupXmlns(child);
        });
    }

    /**
     * Remove redundant xmlns from serialized string
     */
    private removeRedundantXmlns(svgString: string): string {
        // Remove xmlns from nested svg elements but keep the first one
        let firstSvg = true;
        return svgString.replace(/<svg([^>]*)>/g, (match, attrs) => {
            if (firstSvg) {
                firstSvg = false;
                return match; // Keep first svg element as is
            }
            // Remove xmlns from nested svg elements
            const cleanedAttrs = attrs
                .replace(/\s*xmlns="[^"]*"/g, '')
                .replace(/\s*xmlns:xlink="[^"]*"/g, '');
            return `<svg${cleanedAttrs}>`;
        });
    }

    /**
     * Prettify SVG string with proper indentation
     */
    private prettifySvg(svgString: string): string {
        const INDENT = '  '; // 2 spaces for indentation
        let formatted = '';
        let indent = 0;

        // Split by tags
        const parts = svgString.split(/(<[^>]+>)/g).filter(part => part.trim());

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];

            // Check if it's a tag
            if (part.startsWith('<')) {
                const isClosingTag = part.startsWith('</');
                const isSelfClosing = part.endsWith('/>') || this.isSelfClosingTag(part);
                const isOpeningTag = !isClosingTag && !isSelfClosing;

                // Decrease indent for closing tags before adding the line
                if (isClosingTag) {
                    indent = Math.max(0, indent - 1);
                }

                // Add indentation and the tag
                formatted += INDENT.repeat(indent) + part + '\n';

                // Increase indent for opening tags
                if (isOpeningTag) {
                    indent++;
                }
            } else {
                // It's text content between tags
                const trimmed = part.trim();
                if (trimmed) {
                    formatted += INDENT.repeat(indent) + trimmed + '\n';
                }
            }
        }

        return formatted.trim();
    }

    /**
     * Check if a tag is self-closing (like <path />, <circle />, etc.)
     */
    private isSelfClosingTag(tag: string): boolean {
        const selfClosingTags = [
            'path', 'circle', 'rect', 'ellipse', 'line', 'polyline', 'polygon',
            'use', 'image', 'stop', 'animate', 'animateTransform', 'animateMotion',
            'set', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite',
            'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight',
            'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur',
            'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset',
            'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence'
        ];

        const tagName = tag.match(/<(\w+)/)?.[1]?.toLowerCase();
        return tagName ? selfClosingTags.includes(tagName) : false;
    }

    private downloadSvg(svgString: string): void {
        const asBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        saveAs(asBlob, 'uhk-svk-keyboard-layer.svg');
    }
}
