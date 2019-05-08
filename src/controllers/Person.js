import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from './db';

const Person = {
    // create a person
    async create(req, res) {
        const query = 
            `INSERT INTO person(id, email, first_name, last_name, photo, save_photos_to_camera_roll, active_journal_id, date_created, date_modified)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`;

        const values = [
            uuidv4(),
            req.body.email,
            req.body.first_name,
            req.body.last_name,
            req.body.photo,
            req.body.save_photos_to_camera_roll === "true" ? true : false,
            req.body.active_journal_id !== "" ? req.body.active_journal_id : null,
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
    // return person(s)
    async get(req, res) {
        var query = 
            `SELECT * 
            FROM person`;

        if (req.params.id) {
            query += " WHERE id = '" + req.params.id + "'";
        }

        try {
            const { rows, rowCount } = await db.query(query);

            if (req.params.id) {
                if (rows.length === 1) {
                    return res.status(200).send({ rows });
                }
                else {
                    return res.status(404).send({'message': 'person not found'});
                }
            }
            else {
                return res.status(200).send({ rows, rowCount });
            }

        } catch(error) {
            return res.status(400).send(error);
        }
    },
    // update a person
    async update(req, res) {
        const query =
            `UPDATE person
            SET email=$1, first_name=$2, last_name=$3, photo=$4, save_photos_to_camera_roll=$5, active_journal_id=$6, date_modified=$7
            WHERE id=$8 
            RETURNING *`;

        try {
            const values = [
                req.body.email,
                req.body.first_name,
                req.body.last_name,
                req.body.photo,
                req.body.save_photos_to_camera_roll === "true" ? true : false,
                req.body.active_journal_id !== "" ? req.body.active_journal_id : null,
                moment(new Date()),
                req.params.id
            ];

            const response = await db.query(query, values);

            if (response.rows[0]) {
                return res.status(200).send(response.rows[0]);
            }
            else {
                return res.status(404).send({'message': 'person not found'});
            }

        } catch(err) {
            return res.status(400).send(err);
        }
    },
    // delete a person
    async delete(req, res) {
        const query = 
            `DELETE FROM person 
            WHERE id=$1 
            RETURNING *`;
            
        try {
            const { rows } = await db.query(query, [req.params.id]);

            if(rows[0]) {
                return res.status(200).send({ 'message': 'person deleted' });
            } 
            else {
                return res.status(404).send({'message': 'person not found'});
            }

        } catch(error) {
            return res.status(400).send(error);
        }
    }
}

export default Person;