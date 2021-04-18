import Fs from "fs";

export function logIntoFile(data) {
    console.log(data);
    if (typeof data === 'object') {
        data = JSON.stringify(data);
    }
    data += ` - ${new Date().toISOString()}`;
    data += '\n';

    Fs.appendFile('./purchases.log', data, function (err) {
        if (err) throw err;
    });
}
