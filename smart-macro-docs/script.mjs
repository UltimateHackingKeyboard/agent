import {createApp} from './node_modules/vue/dist/vue.esm-browser.prod.js';

// Components

let currentCommand = '';
const variablesToWidgets = {};

function initWidgetValue(name, value) {
    variablesToWidgets[name]?.initValue(value);
}

function setVariable(name, value, isInit) {
    const regexVarName = name.replace(/\\./g, '\\.');
    const regex = new RegExp(`(set +${regexVarName} +)\\S+( *#?)`);
    if (regex.test(currentCommand)) {
        currentCommand = currentCommand.replace(regex, `$1${value}$2`);
    } else {
        currentCommand += (currentCommand.endsWith('\n') ? '' : '\n') + `set ${regexVarName} ${value}\n`;
    }
    const message = {
        action: 'doc-message-set-macro',
        command: currentCommand
    };

    window.parent.postMessage(message, '*');
}

const Checkbox = {
    template: `<input type="checkbox" ref="input" @input="updateValue">`,
    props: {
        name: String,
    },
    data() {
        return {
            value: false,
        };
    },
    mounted() {
        this.updateValue(true);
        variablesToWidgets[this.name] = this;
    },
    methods: {
        updateValue(isInit) {
            this.value = this.$refs.input.checked ? 1 : 0;
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
    },
    data() {
        return {
            value: [],
            selectOptions: [],
        };
    },
    mounted() {
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
        this.updateValue(true);
        variablesToWidgets[this.name] = this;
    },
    methods: {
        updateValue(isInit) {
            this.value = this.$refs.input.value;
            if (isInit !== true) {
                setVariable(this.name, this.value, isInit);
            }
        },
    },
};

const Slider = {
    template: `<input type="range" ref="input" @input="updateValue">{{value}}`,
    props: {
        name: String,
    },
    data() {
        return {
            value: '',
        };
    },
    mounted() {
        this.updateValue(true);
        variablesToWidgets[this.name] = this;
    },
    methods: {
        updateValue(isInit) {
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
                {name:'baseSpeed', desc:'Base speed'},
                {name:'speed', desc:'Speed'},
                {name:'xceleration', desc:'Acceleration speed'},
                {name:'caretSpeedDivisor', desc:'Caret speed divisor'},
                {name:'scrollSpeedDivisor', desc:'Scroll speed divisor'},
            ],
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
                {name:'initialSpeed', desc:'Initial speed'},
                {name:'baseSpeed', desc:'Base speed'},
                {name:'acceleration', desc:'Acceleration'},
                {name:'deceleratedSpeed', desc:'Decelerated speed'},
                {name:'acceleratedSpeed', desc:'Accelerated speed'},
                {name:'axisSkew', desc:'Axis skew'},
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
                    break;
                }

                case 'agent-message-editor-lost-focus': {
                    const data = event.data;
                    currentCommand = '';
                    self.modules = data.modules
                }
            }
        });
        window.parent.postMessage({action: 'doc-message-inited'}, '*');
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
