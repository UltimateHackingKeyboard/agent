import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "led-display",
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./led-display.component.html",
    styleUrls: ["./led-display.component.scss"],
    host: {
        "class": "container-fluid",
    },
})
export class LedDisplayComponent {
    @Input() pinOut: String;

    private lit = "#ff0000";
    private unlit = "#000000";

    D: String;
    C: String;
    L: String;
    M: String;
    N: String;
    E: String;
    G: String;
    g: String;
    B: String;
    K: String;
    J: String;
    H: String;
    F: String;
    A: String;

    ngOnInit() {
        this.D = this.pinOut[0] == '1' ? this.lit : this.unlit;
        this.C = this.pinOut[1] == '1' ? this.lit : this.unlit;
        this.L = this.pinOut[2] == '1' ? this.lit : this.unlit;
        this.M = this.pinOut[3] == '1' ? this.lit : this.unlit;
        this.N = this.pinOut[4] == '1' ? this.lit : this.unlit;
        this.E = this.pinOut[5] == '1' ? this.lit : this.unlit;
        this.G = this.pinOut[6] == '1' ? this.lit : this.unlit;
        this.g = this.pinOut[7] == '1' ? this.lit : this.unlit;
        this.B = this.pinOut[8] == '1' ? this.lit : this.unlit;
        this.K = this.pinOut[9] == '1' ? this.lit : this.unlit;
        this.J = this.pinOut[10] == '1' ? this.lit : this.unlit;
        this.H = this.pinOut[11] == '1' ? this.lit : this.unlit;
        this.F = this.pinOut[12] == '1' ? this.lit : this.unlit;
        this.A = this.pinOut[13] == '1' ? this.lit : this.unlit;
    }
}
