import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from './db';

const JournalEntry = {
    // create a journal entry
    async create(req, res) {
        const minutesWaited = parseInt(req.body.minutes_waited, 10) || 0;
        const rating = parseInt(req.body.rating, 10) || 0;
        const pointsScored = parseInt(req.body.points_scored, 10) || 0;

        const query = 
            `INSERT INTO journal_entry(id, journal_id, park_id, attraction_id, date_journaled, photo, minutes_waited, rating, points_scored, used_fastpass, comments, date_created, date_modified)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING *`;

        const values = [
            uuidv4(),
            req.body.journal_id,
            req.body.park_id,
            req.body.attraction_id,
            req.body.date_journaled !== "" ? req.body.date_journaled : moment(new Date()),
            req.body.photo,
            minutesWaited,
            rating,
            pointsScored,
            req.body.used_fastpass === "true" ? true : false,
            req.body.comments,
            moment(new Date()),
            moment(new Date())
        ];

        try {
            const { rows } = await db.query(query, values);

            return res.status(201).send(rows[0]);
        } catch(error) {
            return res.status(400).send(error);
        }
    },
    // return journal entry(s)
    async get(req, res) {
        var query = 
            `SELECT * 
            FROM journal_entry`;

        if (req.params.id) {
            query += " WHERE id = '" + req.params.id + "'";
        }
        else if (req.query.journal_id) {
            query += " WHERE journal_id = '" + req.query.journal_id + "'";
        }

        try {
            const { rows, rowCount } = await db.query(query);

            if (req.params.id) {
                if (rows.length === 1) {
                    return res.status(200).send({ rows });
                }
                else {
                    return res.status(404).send({'message': 'journal entry not found'});
                }
            }
            else {
                return res.status(200).send({ rows, rowCount });
            }

        } catch(error) {
            return res.status(400).send(error);
        }
    },
    // update a journal entry
    async update(req, res) {
        const minutesWaited = parseInt(req.body.minutes_waited, 10) || 0;
        const rating = parseInt(req.body.rating, 10) || 0;
        const pointsScored = parseInt(req.body.points_scored, 10) || 0;

        const query =
            `UPDATE journal_entry
            SET journal_id=$1, park_id=$2, attraction_id=$3, date_journaled=$4, photo=$5, minutes_waited=$6, rating=$7, points_scored=$8, used_fastpass=$9, comments=$10, date_modified=$11
            WHERE id=$12
            RETURNING *`;

        try {
            const values = [
                req.body.journal_id,
                req.body.park_id,
                req.body.attraction_id,
                req.body.date_journaled !== "" ? req.body.date_journaled : moment(new Date()),
                req.body.photo,
                minutesWaited,
                rating,
                pointsScored,
                req.body.used_fastpass === "true" ? true : false,
                req.body.comments,
                moment(new Date()),
                req.params.id
            ];

            const response = await db.query(query, values);

            if (response.rows[0]) {
                return res.status(200).send(response.rows[0]);
            }
            else {
                return res.status(404).send({'message': 'journal entry not found'});
            }

        } catch(err) {
            return res.status(400).send(err);
        }
    },
    // delete a journal entry
    async delete(req, res) {
        const query = 
            `DELETE FROM journal_entry 
            WHERE id=$1 
            RETURNING *`;
            
        try {
            const { rows } = await db.query(query, [req.params.id]);

            if(rows[0]) {
                return res.status(200).send({ 'message': 'journal entry deleted' });
            } 
            else {
                return res.status(404).send({'message': 'journal entry not found'});
            }

        } catch(error) {
            return res.status(400).send(error);
        }
    }
}

export default JournalEntry;