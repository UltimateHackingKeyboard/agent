import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'layer-tab',
    template:
    `
        <select>
            <option> Activate </option>
            <option> Toggle </option>
        </select>
        <span>the</span>
        <select>
            <option> Mod </option>
            <option> Fn </option>
            <option> Mouse </option>
        </select>
        <span>
        layer by holding this key.
        </span>
    `
})
export class LayerTabComponent implements OnInit {
    constructor() { }

    ngOnInit() { }

}
