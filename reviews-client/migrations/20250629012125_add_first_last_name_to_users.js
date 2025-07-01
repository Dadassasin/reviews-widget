exports.up = function(knex) {
    return knex.schema.alterTable('users', table => {
        table.string('first_name', 255).notNullable().defaultTo('');
        table.string('last_name',  255).notNullable().defaultTo('');
    });
};

exports.down = function(knex) {
    return knex.schema.alterTable('users', table => {
        table.dropColumn('first_name');
        table.dropColumn('last_name');
    });
};
