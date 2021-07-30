const JSZip = require('jszip');

const freeze = async pk => {
    const docSets = Object.keys(pk.docSets);
    const zip = new JSZip();
    for (const docSet of docSets) {
        zip.file(docSet, JSON.stringify(pk.serializeSuccinct(docSet)));
    }
    return zip.generateAsync({type: "base64"});
}

const thaw = async (pk, frozen) => {
    const zip = new JSZip();
    await zip.loadAsync(frozen, {base64: true});
    zip.forEach(async (path, zipEntry) => {
            const content = JSON.parse(await zipEntry.async('binarystring'));
            pk.loadSuccinctDocSet(content);
            console.log('in forEach', path, pk.nDocSets());
        });
    console.log('after forEach', pk.nDocSets());
}

module.exports = {freeze, thaw};
