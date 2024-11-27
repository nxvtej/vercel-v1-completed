import fs from 'fs';
import path from 'path';

export const getAllFiles = (folderpath: string) => {
    let response: string[] = [];

    const allFilesAndFolder = fs.readdirSync(folderpath);
    allFilesAndFolder.forEach(file => {
        const fullFilePath = path.join(folderpath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            // no push as function returns array and not simple file, so
            response = response.concat(getAllFiles(fullFilePath));
        } else {
            response.push(fullFilePath);
        }
    })
    return response;
}

// what if we did not had this recursive folder structure
// and we had to get all files from a single folder
// we could have done this:
/*
export const getAllFiles = (folderpath: string) => {
    return fs.readdirSync(folderpath)
}
*/