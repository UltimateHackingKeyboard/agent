import * as fs from 'fs';

export const getPackageJsonFromPathAsync = async (filePath: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, {encoding: 'utf-8'}, (err, data) => {
            if (err) {
                return reject(err);
            }

            let json: any;
            try {
                json = JSON.parse(data);
            } catch (e) {
                return reject(e);
            }

            return resolve(json);
        });
    });
};
