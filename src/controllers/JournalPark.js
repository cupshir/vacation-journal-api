import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from './db';

const JournalPark = {
    // create a journal park
    async create(req, res) {
        const minutesWaited = parseInt(req.body.minutes_waited, 10) || 0;
        const rating = parseInt(req.body.rating, 10) || 0;
        const pointsScored = parseInt(req.body.points_scored, 10) || 0;

        const query = 
            `INSERT INTO journal_park(id, journal_id, park_id, date_created, date_modified)
            VALUES($1, $2, $3, $4, $5)
            RETURNING *`;

        const values = [
            uuidv4(),
            req.body.journal_id,
            req.body.park_id,
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
    // return journal parks(s)
    async get(req, res) {
        var query = 
            `SELECT * 
            FROM journal_park`;

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
                    return res.status(404).send({'message': 'park not found in journal'});
                }
            }
            else {
                return res.status(200).send({ rows, rowCount });
            }

        } catch(error) {
            return res.status(400).send(error);
        }
    },
    // update a journal park
    async update(req, res) {
        const query =
            `UPDATE journal_park
            SET journal_id=$1, park_id=$2, date_modified=$3
            WHERE id=$4
            RETURNING *`;

        try {
            const values = [
                req.body.journal_id,
                req.body.park_id,
                moment(new Date()),
                req.params.id
            ];

            const response = await db.query(query, values);

            if (response.rows[0]) {
                return res.status(200).send(response.rows[0]);
            }
            else {
                return res.status(404).send({'message': 'park not found in journal'});
            }

        } catch(err) {
            return res.status(400).send(err);
        }
    },
    // delete a journal park
    async delete(req, res) {
        const query = 
            `DELETE FROM journal_park 
            WHERE id=$1 
            RETURNING *`;
            
        try {
            const { rows } = await db.query(query, [req.params.id]);

            if(rows[0]) {
                return res.status(200).send({ 'message': 'park deleted from journal' });
            } 
            else {
                return res.status(404).send({'message': 'park not found in journal'});
            }

        } catch(error) {
            return res.status(400).send(error);
        }
    }
}

export default JournalPark;