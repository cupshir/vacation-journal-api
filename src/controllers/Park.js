import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from './db';

const Park = {
    // create a park
    async create(req, res) {
        const query = 
            `INSERT INTO park(id, name, photo, description, date_created, date_modified)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING *`;
        const values = [
            uuidv4(),
            req.body.name,
            req.body.photo,
            req.body.description,
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
    // return park or all parks
    async get(req, res) {
        var query = 
            `SELECT * 
            FROM park`;

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
                    return res.status(404).send({'message': 'park not found'});
                }
            }
            else {
                return res.status(200).send({ rows, rowCount });
            }

        } catch(error) {
            return res.status(400).send(error);
        }
    },
    // update a park
    async update(req, res) {
        const query =
            `UPDATE park
            SET name=$1,photo=$2,description=$3,date_modified=$4
            WHERE id=$5 
            RETURNING *`;
        try {
            const values = [
                req.body.name,
                req.body.photo,
                req.body.description,
                moment(new Date()),
                req.params.id
            ];

            const response = await db.query(query, values);

            if (response.rows[0]) {
                return res.status(200).send(response.rows[0]);
            }
            else {
                return res.status(404).send({'message': 'park not found'});
            }

        } catch(err) {
            return res.status(400).send(err);
        }
    },
    // delete a park
    async delete(req, res) {
    const query = 
        `DELETE FROM park 
        WHERE id=$1 
        RETURNING *`;
        try {
            const { rows } = await db.query(query, [req.params.id]);

            if(rows[0]) {
                return res.status(204).send({ 'message': 'park deleted' });
            } 
            else {
                return res.status(404).send({'message': 'park not found'});
            }

        } catch(error) {
            return res.status(400).send(error);
        }
    }
}

export default Park;