import pool from "../Models/share_db.js";

const share = async (req, res) => {

    try {

        const {
            file_id,
            shared_with_user_id,
            public_token,
            expires_at,
            owner_id
        } = req.body;


        const result = await pool.query(
        `
        INSERT INTO shares
        (
            file_id,
            owner_id,
            shared_with_user_id,
            public_token,
            expires_at
        )
        VALUES($1,$2,$3,$4,$5)
        RETURNING *
        `,
        [
            file_id,
            owner_id,
            shared_with_user_id ?? null,
            public_token ?? null,
            expires_at ?? null
        ]
        );

        res.status(201).json({
            success: true,
            share: result.rows[0],
            message: "File shared"
        });

    }
    catch(err){

        console.log(err);

        res.status(500).json({
            success:false,
            message:"Error creating share"
        });
    }
}

export default share;