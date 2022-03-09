const JSZip = require('jszip');

const freeze = async pk => {
    const docSets = Object.keys(pk.docSets);
    const zip = new JSZip();
    for (const docSet of docSets) {
        const stringified = JSON.stringify(pk.serializeSuccinct(docSet));
        zip.file(docSet, stringified, {binary: false});
    }
    return zip.generateAsync({type: "base64"});
}

const thaw = async (pk, frozen, selectorFunc, idFunc) => {
    selectorFunc = selectorFunc || function(fo) {return fo};
    idFunc = idFunc || function(io) {return io};
    const zip = new JSZip();
    await zip.loadAsync(frozen, {base64: true});
    const contentPromises = [];
    zip.forEach((path, zipEntry) => {
        const content = zipEntry.async('text');
        contentPromises.push(content);
    });
    await Promise.all(contentPromises)
        .then(
            (contents) =>
                contents.forEach(
                    c => {
                        cJson = JSON.parse(c);
                        cJson.metadata.selectors = selectorFunc(cJson.metadata.selectors);
                        cJson.id = idFunc(cJson.id);
                        return pk.loadSuccinctDocSet(cJson)
                    }
                )
        )
}

module.exports = {freeze, thaw};
