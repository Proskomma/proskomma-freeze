const test = require('tape');

const JSZip = require('jszip');
const { Proskomma } = require('proskomma');
const { pkWithDocs } = require('../lib/load');
const { freeze, thaw } = require('../../src');

const testGroup = 'Basics';

const pk = pkWithDocs([
    ['../test_data/douay_rheims_ecc.usx', {
        lang: 'eng',
        abbr: 'drh',
    }],
    ['../test_data/douay_rheims_psa.usx', {
        lang: 'eng',
        abbr: 'drh',
    }],
    ['../test_data/web_psa150.usx', {
        lang: 'eng',
        abbr: 'web',
    }],
    ['../test_data/web_rut.usx', {
        lang: 'eng',
        abbr: 'web',
    }],
]);

test(
    `Freeze (${testGroup})`,
    async function (t) {
        try {
            t.plan(3);
            const frozen = await freeze(pk);
            const zip = new JSZip();
            await zip.loadAsync(frozen, {base64: true});
            let docSets = []
            zip.forEach(path => docSets.push(path));
            t.equal(docSets.length, 2);
            t.ok(docSets.includes('eng_drh'));
            t.ok(docSets.includes('eng_web'));
        } catch (err) {
            console.log(err);
        }
    },
);

test(
    `Thaw (${testGroup})`,
    async function (t) {
        try {
            t.plan(3);
            const frozen = await freeze(pk);
            const pk2 = new Proskomma();
            await thaw(pk2, frozen);
            t.equal(pk2.nDocSets(), 2);
            t.ok('eng_drh' in pk2.docSets);
            t.ok('eng_web' in pk2.docSets);
        } catch (err) {
            console.log(err);
        }
    },
);
