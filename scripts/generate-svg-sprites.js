const SVGSpriter = require('svg-sprite');
const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');
const config = {
    "dest": "packages/web/src/assets/",
    log: 'verbose',
    'shape': {
        'id': {
            'generator': function (name) {
                return 'icon-' + path.basename(name).slice(0, -4);
            }
        }
    },
    'mode': {
        'defs': {
            'inline': true,
            'dest': './',
            'sprite': 'compiled_sprite.svg',
            bust:false
        }
    }
};
const spriter = new SVGSpriter(config);

// Register some SVG files with the spriter
addInputSvgs(path.join(__dirname, '../packages/web/src/svgs'));

// Compile the sprite
spriter.compile(function (error, result, cssData) {

    // Run through all configured output modes
    for (const mode in result) {

        // Run through all created resources and write them to disk
        for (const type in result[mode]) {
            mkdirp.sync(path.dirname(result[mode][type].path));
            fs.writeFileSync(result[mode][type].path, result[mode][type].contents);
        }
    }
});

function addInputSvgs(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            return addInputSvgs(fullPath)
        }
        if (path.extname(file) === '.svg') {
            spriter.add(fullPath, file, fs.readFileSync(fullPath, { encoding: 'utf-8' }));
        }
    });

}
