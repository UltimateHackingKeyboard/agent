import {createApp} from './node_modules/vue/dist/vue.esm-browser.prod.js';

// Components

let currentCommand = '';
const widgetDict = {};

function updateWidgets() {
    for (const widgetName in widgetDict) {
        const widget = widgetDict[widgetName];
        widget.initWidget();
    }
}

function getVariable(name) {
    const regexVarName = name.replace(/\\./g, '\\.');
    const regex = new RegExp(`set +${regexVarName} +(\\S+) *#?`);
    const matches = currentCommand.match(regex);
    const value = matches?.[1];
    return value;
}

function setVariable(name, value) {
    const regexVarName = name.replace(/\\./g, '\\.');
    const regex = new RegExp(`(set +${regexVarName} +)\\S+( *#?)`);
    if (regex.test(currentCommand)) {
        currentCommand = currentCommand.replace(regex, `$1${value}$2`);
    } else {
        currentCommand += (currentCommand.endsWith('\n') ? '' : '\n') + `set ${regexVarName} ${value}\n`;
    }
    const message = {
        action: 'doc-message-set-macro',
        command: currentCommand,
    };

    window.parent.postMessage(message, '*');
}

const Checkbox = {
    template: `<input type="checkbox" ref="input" @input="updateValue">`,
    props: {
        name: String,
        default: Number,
    },
    data() {
        return {
            value: this.default,
        };
    },
    mounted() {
        this.updateValue(true);
        widgetDict[this.name] = this;
    },
    methods: {
        initWidget() {
            const value = getVariable(this.name) ?? this.default;
            this.value = this.$refs.input.value = value;
        },
        updateValue(isInit) {
            if (isInit === true) {
                this.$refs.input.checked = this.default === '1' ? 'checked' : 0;
            }
            this.value = +this.$refs.input.checked ? 1 : 0;
            if (isInit !== true) {
                setVariable(this.name, this.value, isInit);
            }
        },
    },
};

const Dropdown = {
    template: `<select ref="input" @input="updateValue" class="form-select"><option v-for="option in selectOptions" :value="option.value">{{option.label}}</option></select>`,
    props: {
        name: String,
        options: String,
        default: String,
    },
    data() {
        return {
            value: this.default,
            selectOptions: [],
        };
    },
    async mounted() {
        const allOptions = {
            modifierTriggers: [
                {label:'Both', value:'both'},
                {label:'Left', value:'left'},
                {label:'Right', value:'right'},
            ],
            navigationModes: [
                {label:'Cursor', value:'cursor'},
                {label:'Scroll', value:'scroll'},
                {label:'Caret', value:'caret'},
                {label:'Media', value:'media'},
                {label:'Zoom', value:'zoom'},
                {label:'Zoom PC', value:'zoomPc'},
                {label:'Zoom Mac', value:'zoomMac'},
                {label:'None', value:'none'},
            ],
        }
        this.selectOptions = allOptions[this.options];
        await this.$nextTick();
        this.updateValue(true);
        widgetDict[this.name] = this;
    },
    methods: {
        initWidget() {
            const value = getVariable(this.name) ?? this.default;
            this.value = this.$refs.input.value = value;
        },
        updateValue(isInit) {
            if (isInit === true) {
                this.$refs.input.value = this.default;
            }

            this.value = this.$refs.input.value;
            if (isInit !== true) {
                setVariable(this.name, this.value, isInit);
            }
        },
    },
};

const Slider = {
    template: `<input type="range" ref="input" @input="updateValue" :min="min" :max="max" :step="step">{{value}}`,
    props: {
        name: String,
        min: Number,
        max: Number,
        step: Number,
        default: Number,
    },
    data() {
        return {
            value: this.default,
        };
    },
    mounted() {
        this.updateValue(true);
        widgetDict[this.name] = this;
    },
    methods: {
        initWidget() {
            const value = getVariable(this.name) ?? this.default;
            this.value = this.$refs.input.value = value;
        },
        updateValue(isInit) {
            if (isInit === true) {
                this.$refs.input.value = this.default;
            }
            this.value = this.$refs.input.value;
            if (isInit !== true) {
                setVariable(this.name, this.value, isInit);
            }
        },
    },
};

// Init Vue

const app = createApp({
    data() {
        return {
            modules: [],
            moduleStrings: {
                2: 'keycluster',
                3: 'trackball',
                4: 'trackpoint',
                5: 'touchpad',
            },
            moduleDescriptions: {
                2: 'Key cluster',
                3: 'Trackball',
                4: 'Trackpoint',
                5: 'Touchpad',
            },
            moduleSpeedProps: [
                {name:'baseSpeed', desc:'Base speed', min:0, max:10, step:0.1,
                    perModuleDefaults: {3:0.5, 4:0.0, 5:0.5},
                },
                {name:'speed', desc:'Speed', min:0, max:10, step:0.1,
                    perModuleDefaults: {3:0.5, 4:1.0, 5:0.7},
                },
                {name:'xceleration', desc:'Acceleration speed', min:0, max:1, step:0.1,
                    perModuleDefaults: {3:1.0, 4:0.0, 5:1.0},
                },
                {name:'caretSpeedDivisor', desc:'Caret speed divisor', min:0, max:100, step:1,
                    perModuleDefaults: {3:16.0, 4:16.0, 5:16.0},
                },
                {name:'scrollSpeedDivisor', desc:'Scroll speed divisor', min:0, max:100, step:1,
                    perModuleDefaults: {3:8.0, 4:8.0, 5:8.0},
                },
            ],
            axisLockSkewDefaults: {2:0.5, 3:0.5, 4:0.5, 5:0.5},
            axisLockFirstTickSkewDefaults: {2:0.5, 3:2.0, 4:2.0, 5:2.0},
            layers: [
                'Base',
                'Mod',
                'Mouse',
                'Fn',
                'Fn2',
                'Fn3',
                'Fn4',
                'Fn5',
                'Shift',
                'Ctrl',
                'Alt',
                'Super',
            ],
            modifiers: [
                'Shift',
                'Ctrl',
                'Alt',
                'Super',
            ],
            modifierTriggers: [
                'Both',
                'Left',
                'Right',
            ],
            keySpeedProps: [
                {
                    name:'initialSpeed',
                    desc:'Initial speed',
                    sliderProps: {
                        move: {min:25, default:100, max:6375, step:25},
                        scroll: {min:1, default:20, max:255, step:1},
                    },
                },
                {
                    name:'baseSpeed',
                    desc:'Base speed',
                    sliderProps: {
                        move: {min:25, default:800, max:6375, step:25},
                        scroll: {min:1, default:20, max:255, step:1},
                    },
                },
                {
                    name:'acceleration',
                    desc:'Acceleration',
                    sliderProps: {
                        move: {min:25, default:1700, max:6375, step:25},
                        scroll: {min:1, default:20, max:255, step:1},
                    },
                },
                {
                    name:'deceleratedSpeed',
                    desc:'Decelerated speed',
                    sliderProps: {
                        move: {min:25, default:200, max:6375, step:25},
                        scroll: {min:1, default:10, max:255, step:1},
                    },
                },
                {
                    name:'acceleratedSpeed',
                    desc:'Accelerated speed',
                    sliderProps: {
                        move: {min:25, default:1600, max:6375, step:25},
                        scroll: {min:1, default:50, max:255, step:1},
                    },
                },
                {
                    name:'axisSkew',
                    desc:'Axis skew',
                    sliderProps: {
                        move: {min:0.5, default:1, max:2, step:0.1},
                        scroll: {min:0.5, default:1, max:2, step:0.1},
                    },
                },
            ],
        };
    },
    created() {
        const self = this;
        window.addEventListener('message', function(event) {
            switch (event.data.action) {
                case 'agent-message-editor-got-focus': {
                    const data = event.data;
                    currentCommand = data.command;
                    self.modules = data.modules;
                    updateWidgets();
                    break;
                }

                case 'agent-message-editor-lost-focus': {
                    const data = event.data;
                    currentCommand = '';
                    self.modules = data.modules;
                    updateWidgets();
                    break;
                }
            }
        });
        window.parent.postMessage({action: 'doc-message-inited'}, '*');
    },
    methods: {
        getNavigationMode(module, layer) {
            if (module === 2) {
                return {Base:'scroll', Mod:'cursor', Fn:'caret'}[layer] ?? 'cursor';
            }
            return {Base:'cursor', Mod:'scroll', Fn:'caret'}[layer] ?? 'cursor';
        },
    },
    computed: {
        rightModules() {
            return this.modules.filter(module => module !== 2);
        }
    }
});

app.component('Checkbox', Checkbox);
app.component('Dropdown', Dropdown);
app.component('Slider', Slider);

app.mount('body');
