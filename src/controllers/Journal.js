import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from './db';

const Journal = {
    // create a journal
    async create(req, res) {
        const query = 
            `INSERT INTO journal(id, name, photo, date_start, date_end, person_id, date_created, date_modified)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`;

        const values = [
            uuidv4(),
            req.body.name,
            req.body.photo,
            req.body.date_start !== "" ? req.body.date_start : null ,
            req.body.date_end !== "" ? req.body.date_end : null,
            req.body.person_id,
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
    // return journal(s)
    async get(req, res) {
        var query = 
            `SELECT * 
            FROM journal`;

        if (req.params.id) {
            query += " WHERE id = '" + req.params.id + "'";
        }
        else if (req.query.person_id) {
            query += " WHERE person_id = '" + req.query.person_id + "'";
        }

        try {
            const { rows, rowCount } = await db.query(query);

            if (req.params.id) {
                if (rows.length === 1) {
                    return res.status(200).send({ rows });
                }
                else {
                    return res.status(404).send({'message': 'journal not found'});
                }
            }
            else {
                return res.status(200).send({ rows, rowCount });
            }

        } catch(error) {
            return res.status(400).send(error);
        }
    },
    // update a journal
    async update(req, res) {
        const query =
            `UPDATE journal
            SET name=$1, photo=$2, date_start=$3, date_end=$4, person_id=$5, date_modified=$6
            WHERE id=$7 
            RETURNING *`;

        try {
            const values = [
                req.body.name,
                req.body.photo,
                req.body.date_start !== "" ? req.body.date_start : null ,
                req.body.date_end !== "" ? req.body.date_end : null,
                req.body.person_id,
                moment(new Date()),
                req.params.id
            ];

            const response = await db.query(query, values);

            if (response.rows[0]) {
                return res.status(200).send(response.rows[0]);
            }
            else {
                return res.status(404).send({'message': 'journal not found'});
            }

        } catch(err) {
            return res.status(400).send(err);
        }
    },
    // delete a journal
    async delete(req, res) {
        const query = 
            `DELETE FROM journal 
            WHERE id=$1 
            RETURNING *`;
            
        try {
            const { rows } = await db.query(query, [req.params.id]);

            if(rows[0]) {
                return res.status(200).send({ 'message': 'journal deleted' });
            } 
            else {
                return res.status(404).send({'message': 'journal not found'});
            }

        } catch(error) {
            return res.status(400).send(error);
        }
    }
}

export default Journal;