const path = require('path');
const fse = require('fs-extra');

const { Proskomma } = require('proskomma');

const pkWithDocs = (contentSpecs) => {
  const pk = new Proskomma();

  for (const [fp, selectors] of contentSpecs) {
    const content = fse.readFileSync(path.resolve(__dirname, fp));
    let contentType = fp.split('.').pop();
    pk.importDocument(
      selectors,
      contentType,
      content,
      {},
    );
  }
  return pk;
};

module.exports = { pkWithDocs };
