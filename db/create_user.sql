INSERT INTO users (email, user_password)
VALUES ($1, $2)
RETURNING *;

-- RETURNING * === select * from users where email = $1;
