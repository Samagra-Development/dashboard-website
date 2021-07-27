const csv = require('csv-parser');
const fs = require('fs');
const schoolMaster = [];
const mentorsMaster = [];
const districtBlockMaster = [];
fs.createReadStream('server/school-master.csv')
    .pipe(csv())
    .on('data', (row) => {
        schoolMaster.push(row)
    })
    .on('end', () => {
        fs.createReadStream('server/district-block-master.csv')
            .pipe(csv())
            .on('data', (row) => {
                districtBlockMaster.push(row)
            })
            .on('end', () => {
                fs.createReadStream('server/mentors-master.csv')
                    .pipe(csv())
                    .on('data', (row) => {
                        mentorsMaster.push(row)
                    })
                    .on('end', () => {
                        startConversion()
                    });
            });
    });

function startConversion() {
    let data = JSON.stringify(mentorsMaster);
    fs.writeFileSync('mentorsMaster.json', data);
    data = JSON.stringify(schoolMaster);
    fs.writeFileSync('schoolMaster.json', data);
    data = JSON.stringify(districtBlockMaster);
    fs.writeFileSync('districtBlockMaster.json', data);
}
