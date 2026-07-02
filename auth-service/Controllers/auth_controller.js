import pool from "../Models/auth_db.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const sign_up = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const data = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (data.rows.length > 0) {
            console.log('User already exists');
            return res.status(409).json({ message: 'User already exists' })
        }

        else {
            const hashpassword = await bcrypt.hash(password, 10)

            const query = 'INSERT INTO users (name, email, hashed_password) VALUES ($1, $2, $3) RETURNING *'
            const values = [name, email, hashpassword]

            pool.query(query, values)
                .then((result) => {
                    res.status(201).json({ message: 'User created successfully', user: result.rows[0] })
                }).catch((err) => {
                    console.error('Error executing query', err.stack)
                    res.status(500).json({ message: 'Internal Server Error' })
                })
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            console.log('User does not exist');
            return res.status(403).json({ message: 'User not found', success: false })
        }

        else {
            const cmpPass = await bcrypt.compare(password, result.rows[0].hashed_password)        //checks password

            if (!cmpPass) {
                console.log('Invalid password');
                return res.status(403).json({ message: 'Invalid password', success: false })
            }

            const token = jwt.sign(
                {
                    email: result.rows[0].email,
                    id: result.rows[0].id,
                    name: result.rows[0].name,
                    c_at: result.rows[0].created_at
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' })                                                      // jwt token generation

            // res.cookie('token', token)                                                    //uploaded token to cookie

            res.status(200)
                .json({
                    user: {
                        id: result.rows[0].id,
                        email: result.rows[0].email,
                        name: result.rows[0].name,
                    },
                    message: 'Login successful',
                    token: token,
                    success: true
                })
        }


    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }

}
export { sign_up, login }