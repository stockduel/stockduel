//stock_prices_archive table Schema
//--------------------------------
module.exports = function (knex) {
    return knex.schema.createTableIfNotExists('stock_prices_archive', function (table) {
        table.increments('archive_id').primary();
        table.integer('stock_id')
            .references('s_id')
            .inTable('stocks');
        table.string('symbol');
        table.string('bid');
        table.string('ask');
        table.string('change');
        table.string('days_low');
        table.string('days_high');
        table.string('year_low');
        table.string('year_high');
        table.string('earnings_share');
        table.string('eps_estimate_current_year');
        table.string('eps_estimate_next_year');
        table.string('market_capitalization');
        table.string('ebitda');
        table.string('days_range');
        table.string('open');
        table.string('previous_close');
        table.string('pe_ratio');
        table.string('peg_ratio');
        table.string('percent_change');
        table.string('volume');
        table.string('timestamp');
    });
};
