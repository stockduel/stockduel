module.exports = function (knex) {
    return knex.schema.createTableIfNotExists('matches', function (table) {
        table.increments('m_id').primary();
        table.integer('creator_id')
            .references('u_id')
            .inTable('users');
        table.integer('starting_funds');
        table.integer('challengee')
            .references('u_id')
            .inTable('users');
        table.string('startdate');
        table.string('enddate');
        table.string('status');
        table.string('type');
    });
};
