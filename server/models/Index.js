const {buildSchemaUsers} = require('./User');
const {buildSchemaProjects} = require('./Project');
const {buildSchemaTasks} = require('./Task');
const {buildSchemaProjectMembers} = require('./ProjectMember');

const buildSchema = async () => {
    try {
        await buildSchemaUsers();
        await buildSchemaProjects();
        await buildSchemaTasks();
        await buildSchemaProjectMembers();
        console.log('All tables created successfully');
    } catch (err) {
        console.error('Error creating tables:', err);
    }
}

module.exports = { buildSchema };