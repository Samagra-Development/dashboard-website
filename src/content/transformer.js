// const districtBlockMaster = require('districtBlockMaster');
// const mentorsMaster = require('mentorsMaster');
// const npMaster = require('np-master');
const fs = require('fs');

let districtBlockMaster = fs.readFileSync('./districtBlockMaster.json');
let mentorsMaster = fs.readFileSync('./mentorsMaster.json');
let npMaster = fs.readFileSync('./np-master.json');
districtBlockMaster = JSON.parse(districtBlockMaster);
mentorsMaster = JSON.parse(mentorsMaster);
npMaster = JSON.parse(npMaster);


function transform(array) {
    array.forEach((d) => {
        for (let i in d) {
            if (d[i]) {
                d[i] = d[i].toUpperCase();
            }
        }
    });
}

transform(districtBlockMaster);
transform(mentorsMaster);
transform(npMaster);
let districtBlockMasterData = JSON.stringify(districtBlockMaster);
fs.writeFileSync('./districtBlockMaster.json', districtBlockMasterData);
let mentorsMasterData = JSON.stringify(mentorsMaster);
fs.writeFileSync('./mentorsMaster.json', mentorsMasterData);
let npMasterData = JSON.stringify(npMaster);
fs.writeFileSync('./np-master.json', npMasterData);
