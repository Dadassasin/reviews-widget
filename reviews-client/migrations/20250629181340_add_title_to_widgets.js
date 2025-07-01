exports.up = function(knex) {
    return knex.schema.alterTable('widgets', function(table) {
        table.string('title', 255).notNullable().defaultTo('');
    });
};

exports.down = function(knex) {
    return knex.schema.alterTable('widgets', function(table) {
        table.dropColumn('title');
    });
};
