const readXlsxFile = require('read-excel-file/node');
const fs = require('fs');

function readMeta() {
    const metaObject = [];
    readXlsxFile('server/meta.xlsx').then((rows) => {
            for (let i = 1; i < rows.length; i++) {
                let districtFound = false;
                for (let district = 0; district < metaObject.length; district++) {
                    if (metaObject[district].name === rows[i][0]) {
                        districtFound = true;
                        let blockFound = false;
                        for (let block = 0; block < metaObject[district].blocks.length; block++) {
                            if (metaObject[district].blocks[block].name === rows[i][1]) {
                                blockFound = true;
                                metaObject[district].blocks[block].schools.push({name: rows[i][2], code: rows[i][3]});
                            }
                        }
                        if (!blockFound) {
                            metaObject[district].blocks.push({
                                name: rows[i][1],
                                schools: [{name: rows[i][2], code: rows[i][3]}]
                            })
                        }
                    }
                }
                if (!districtFound) {
                    metaObject.push({
                        name: rows[i][0], blocks: [{name: rows[i][1], schools: [{name: rows[i][2], code: rows[i][3]}]}]
                    })
                }
            }
            const finalData = {
                districts: [],
                metaVersion: 1,
            };
            metaObject.forEach((m) => {
                finalData.districts.push(m.name);
                m.blocks.forEach((mb) => {
                    if (!finalData['Blocks-' + m.name]) {
                        finalData['Blocks-' + m.name] = [];
                    }
                    finalData['Blocks-' + m.name].push(mb.name);
                    mb.schools.forEach((mbs) => {
                        if (!finalData['Blocks-' + m.name + '-Schools-' + mb.name]) {
                            finalData['Blocks-' + m.name + '-Schools-' + mb.name] = [];
                            finalData['Blocks-' + m.name + '-SchoolCodes-' + mb.name] = [];
                        }
                        finalData['Blocks-' + m.name + '-Schools-' + mb.name].push(mbs.name);
                        finalData['Blocks-' + m.name + '-SchoolCodes-' + mb.name].push(mbs.code);
                    })
                })
            });
            let data = JSON.stringify(finalData);
            fs.writeFileSync('data.json', data)
        }
    )
}

readMeta();
