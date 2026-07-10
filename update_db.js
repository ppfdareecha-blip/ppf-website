const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: 'c:/Users/SHUBASH/Desktop/2026/PPF_Main/PPF-New/ppf-website/.env' });

const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
    .then(async () => {
        console.log('Connected to DB');

        // We create generic schemas to update center fields
        const Event = mongoose.model('Event', new mongoose.Schema({}, { strict: false }));
        const Opinion = mongoose.model('Opinion', new mongoose.Schema({}, { strict: false }));
        const UnApprovedOpinion = mongoose.model('UnApprovedOpinion', new mongoose.Schema({}, { strict: false }));

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

        const models = [Event, Opinion, UnApprovedOpinion];

        for (const model of models) {
            console.log(`Updating ${model.modelName}...`);
            const docs = await model.find({});
            for (const doc of docs) {
                let updated = false;
                if (doc.get('center')) {
                    const oldCenter = doc.get('center');
                    const match = mappings.find(m => m.old === oldCenter);
                    if (match) {
                        doc.set('center', match.new);
                        updated = true;
                    } else {
                        // In case exact match fails, do replace
                        let newCenter = oldCenter;
                        mappings.forEach(m => {
                            if (newCenter.includes(m.old)) {
                                newCenter = newCenter.replace(m.old, m.new);
                            }
                        });
                        if (newCenter !== oldCenter) {
                            doc.set('center', newCenter);
                            updated = true;
                        }
                    }
                }
                if (updated) {
                    await doc.save();
                    console.log(`Updated doc ${doc._id} in ${model.modelName}`);
                }
            }
        }

        console.log('Done DB update');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
