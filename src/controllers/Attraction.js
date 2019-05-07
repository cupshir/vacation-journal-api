import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from './db';

const Attraction = {
    // create a attraction
    async create(req, res) {
        const heightToRide = parseInt(req.body.height_to_ride, 10) || 0;
        
        const query = 
            `INSERT INTO attraction(id, name, park_id, photo, description, height_to_ride, has_score, date_created, date_modified)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`;

        const values = [
            uuidv4(),
            req.body.name,
            req.body.park_id,
            req.body.photo,
            req.body.description,
            heightToRide,
            req.body.has_score === "true" ? true : false,
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
    // return attraction(s)
    async get(req, res) {
        var query = 
            `SELECT * 
            FROM attraction`;

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
                    return res.status(404).send({'message': 'attraction not found'});
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
        const heightToRide = parseInt(req.body.height_to_ride, 10) || 0;

        const query =
            `UPDATE attraction
            SET name=$1, park_id=$2, photo=$3, description=$4, height_to_ride=$5, has_score=$6, date_modified=$7
            WHERE id=$8
            RETURNING *`;

        try {
            const values = [
                req.body.name,
                req.body.park_id,
                req.body.photo,
                req.body.description,
                heightToRide,
                req.body.has_score === "true" ? true : false,
                moment(new Date()),
                req.params.id
            ];

            const response = await db.query(query, values);

            if (response.rows[0]) {
                return res.status(200).send(response.rows[0]);
            }
            else {
                return res.status(404).send({'message': 'attraction not found'});
            }

        } catch(err) {
            return res.status(400).send(err);
        }
    },
    // delete a park
    async delete(req, res) {
        const query = 
            `DELETE FROM attraction 
            WHERE id=$1 
            RETURNING *`;
            
        try {
            const { rows } = await db.query(query, [req.params.id]);

            if(rows[0]) {
                return res.status(204).send({ 'message': 'attraction deleted' });
            } 
            else {
                return res.status(404).send({'message': 'attraction not found'});
            }

        } catch(error) {
            return res.status(400).send(error);
        }
    }
}

export default Attraction;