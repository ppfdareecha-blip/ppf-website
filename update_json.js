const fs = require('fs');
const path = require('path');

const mappings = [
    // RISE
    { old: 'Centre for Women and Child Welfare', new: 'Centre for Rights, Inclusion and Social Empowerment' },
    { old: 'Centre for Cohesive Society Studies', new: 'Centre for Rights, Inclusion and Social Empowerment' },
    { old: 'Centre for Equity and Diversity Studies', new: 'Centre for Rights, Inclusion and Social Empowerment' },
    { old: 'Centre for Women and Child Welfare (PPF-CWCW) ', new: 'Centre for Rights, Inclusion and Social Empowerment (PPF-RISE)' },
    { old: 'Centre for Cohesive Society Studies (PPF-CCSS)', new: 'Centre for Rights, Inclusion and Social Empowerment (PPF-RISE)' },
    { old: 'Centre for Equity and Diversity Studies (PPF-CEDS)', new: 'Centre for Rights, Inclusion and Social Empowerment (PPF-RISE)' },
    { old: 'PPF-CWCW', new: 'PPF-RISE' },
    { old: 'PPF-CCSS', new: 'PPF-RISE' },
    { old: 'PPF-CEDS', new: 'PPF-RISE' },

    // CACTAS
    { old: 'Centre for New Technologies', new: 'Centre for Critical & Advanced Technologies and Systems' },
    { old: 'Centre for New Technologies (PPF-CNT)', new: 'Centre for Critical & Advanced Technologies and Systems (PPF-CACTAS)' },
    { old: 'PPF-CNT', new: 'PPF-CACTAS' },

    // SAGE
    { old: 'Centre for Neighbourhood Studies', new: 'Centre for Security and Geo-Economics' },
    { old: 'Centre for Radicalisation and Security Studies', new: 'Centre for Security and Geo-Economics' },
    { old: 'Centre for Neighbourhood Studies (PPF-CNS)', new: 'Centre for Security and Geo-Economics (PPF-SAGE)' },
    { old: 'Centre for Radicalisation and Security Studies (PPF-CRSS)', new: 'Centre for Security and Geo-Economics (PPF-SAGE)' },
    { old: 'PPF-CNS', new: 'PPF-SAGE' },
    { old: 'PPF-CRSS', new: 'PPF-SAGE' },

    // CRES
    { old: 'Centre for Disaster Risk Reduction and Management', new: 'Centre for Climate, Resilience, Environment and Sustainability' },
    { old: 'Centre for Disaster Risk Reduction and Management (PPF-CDRRM)', new: 'Centre for Climate, Resilience, Environment and Sustainability (PPF-CRES)' },
    { old: 'PPF-CDRRM', new: 'PPF-CRES' },
];

const filesToUpdate = ['Events.json', 'Opinions.json', 'Team.json'];

filesToUpdate.forEach(file => {
    const filePath = path.join(__dirname, 'data', file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let hasChanges = false;

        mappings.forEach(m => {
            if (content.includes(m.old)) {
                // global replace
                content = content.split(m.old).join(m.new);
                hasChanges = true;
            }
        });

        if (hasChanges) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${file}`);
        } else {
            console.log(`No changes in ${file}`);
        }
    }
});
