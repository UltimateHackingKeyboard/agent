import * as fs from 'fs';

export const getPackageJsonFromPathAsync = async (filePath: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, {encoding: 'utf-8'}, (err, data) => {
            if (err) {
                return reject(err);
            }

            resolve(JSON.parse(data));
        });
    });
};
