const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
    console.log('connected to the db');
});

/**
 * Dev Util Function 
 */
const devUtil = () => {
    const queryText = 
        `CREATE TABLE IF NOT EXISTS
        journal_park(
            id UUID PRIMARY KEY,
            journal_id UUID NOT NULL,
            park_id UUID NOT NULL,
            date_created TIMESTAMP NOT NULL,
            date_modified TIMESTAMP NOT NULL
        );
        ALTER TABLE
            journal_park ADD CONSTRAINT fk_journal_park_journal FOREIGN KEY (journal_id) REFERENCES journal (id);
        ALTER TABLE
            journal_park ADD CONSTRAINT fk_journal_park_park FOREIGN KEY (park_id) REFERENCES park (id);`;

    queryDb(queryText);
}

/**
 * Create Tables
 */
const createTables = () => {
    const queryText =
        `CREATE TABLE IF NOT EXISTS
            person(
                id UUID PRIMARY KEY,
                email VARCHAR(128) NOT NULL,
                first_name VARCHAR(128) NOT NULL,
                last_name VARCHAR(128) NOT NULL,
                photo BYTEA,
                save_photos_to_camera_roll BOOLEAN,
                active_journal_id UUID,
                date_created TIMESTAMP,
                date_modified TIMESTAMP
            );
        CREATE TABLE IF NOT EXISTS
            park(
                id UUID PRIMARY KEY,
                name VARCHAR(128) NOT NULL,
                photo BYTEA,
                description TEXT,
                date_created TIMESTAMP NOT NULL,
                date_modified TIMESTAMP NOT NULL
            );
        CREATE TABLE IF NOT EXISTS
            attraction(
                id UUID PRIMARY KEY,
                name VARCHAR(128) NOT NULL,
                park_id UUID NOT NULL,
                photo BYTEA,
                description TEXT,
                height_to_ride INTEGER,
                has_score BOOLEAN NOT NULL,
                date_created TIMESTAMP NOT NULL,
                date_modified TIMESTAMP NOT NULL
            );
        CREATE TABLE IF NOT EXISTS
            journal(
                id UUID PRIMARY KEY,
                name VARCHAR(128) NOT NULL,
                photo BYTEA,
                date_start TIMESTAMP,
                date_end TIMESTAMP,
                person_id UUID NOT NULL,
                date_created TIMESTAMP NOT NULL,
                date_modified TIMESTAMP NOT NULL
            );
        CREATE TABLE IF NOT EXISTS
            journal_entry(
                id UUID PRIMARY KEY,
                journal_id UUID NOT NULL,
                park_id UUID NOT NULL,
                attraction_id UUID NOT NULL,
                date_journaled TIMESTAMP NOT NULL,
                photo BYTEA,
                minutes_waited INTEGER NOT NULL,
                rating INTEGER NOT NULL,
                points_scored INTEGER,
                used_fastpass BOOLEAN NOT NULL,
                comments TEXT,
                date_created TIMESTAMP NOT NULL,
                date_modified TIMESTAMP NOT NULL
            );
        CREATE TABLE IF NOT EXISTS
            journal_park(
                id UUID PRIMARY KEY,
                journal_id UUID NOT NULL,
                park_id UUID NOT NULL,
                date_created TIMESTAMP NOT NULL,
                date_modified TIMESTAMP NOT NULL
            );
        ALTER TABLE 
            person ADD CONSTRAINT fk_person_journal FOREIGN KEY (active_journal_id) REFERENCES journal (id);
        ALTER TABLE 
            attraction ADD CONSTRAINT fk_attraction_park FOREIGN KEY (park_id) REFERENCES park (id);
        ALTER TABLE 
            journal ADD CONSTRAINT fk_journal_person FOREIGN KEY (person_id) REFERENCES person (id) ON DELETE CASCADE;   
        ALTER TABLE 
            journal_entry ADD CONSTRAINT fk_journal_entry_journal FOREIGN KEY (journal_id) REFERENCES journal (id) ON DELETE CASCADE;
        ALTER TABLE 
            journal_entry ADD CONSTRAINT fk_journal_entry_park FOREIGN KEY (park_id) REFERENCES park (id);
        ALTER TABLE 
            journal_entry ADD CONSTRAINT fk_journal_entry_attraction FOREIGN KEY (attraction_id) REFERENCES attraction (id);
        ALTER TABLE
            journal_park ADD CONSTRAINT fk_journal_park_journal FOREIGN KEY (journal_id) REFERENCES journal (id);
        ALTER TABLE
            journal_park ADD CONSTRAINT fk_journal_park_park FOREIGN KEY (park_id) REFERENCES park (id);`;
            
    queryDb(queryText);
}

const addConstraints = () => {
    const queryText =
        `ALTER TABLE 
            person ADD CONSTRAINT fk_person_journal FOREIGN KEY (active_journal) REFERENCES journal (id);`;

    queryDb(queryText);
}

/**
 * Drop Tables
 */
const dropTables = () => {
    const queryText = 
        `DROP TABLE IF EXISTS journal_entry CASCADE;
        DROP TABLE IF EXISTS journal CASCADE;
        DROP TABLE IF EXISTS attraction CASCADE;
        DROP TABLE IF EXISTS park CASCADE;
        DROP TABLE IF EXISTS person CASCADE;`;

    queryDb(queryText);
}

function queryDb(queryText) {
    pool.query(queryText)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
}

pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
});

module.exports = {
    devUtil,
    createTables,
    addConstraints,
    dropTables
};

require('make-runnable');