const bcrypt = require('bcryptjs');

module.exports = {
    register: (req,res,next) => {
        // set db = to req.app.get('db') so we have access to our database
        const db = req.app.get('db')
         // destructure the emial and password
        const { email, password } = req.body;
       
        // check the database if the email taht was sent, already exists
        db.check_user_exists(email).then(user => {
            if(user.length){
                // if the email exists we will send an error message
                res.status(200).send("Email already exists in database");
            } else {
                // if the email is not in the database we will create the user

                //declare salt rounds, should be 12
                const saltRounds = 12;
                // pass salt round to bcrypt.genSalt to get the salt to be used in the hasing our passowrd
               
                bcrypt.genSalt(saltRounds).then(salt => {
                 // pass the password and the generated salt rounds to the bcrypt.hash method yo create
                // a hashed password
                 bcrypt.hash(password, salt).then(hashedPassword => {
                     // create user in database with the email they sent a;ong with the hased password
                    db.create_user([email, hashedPassword]).then(createdUser => {
                    // set the returned created user to a session and send the session as response
                        console.log('hit')
                        req.session.user = {
                            id: createdUser[0].id,
                            email: createdUser[0].email
                        }
                        res.status(200).send(req.session.user)
                    })
                 })
                })
            }
        }).catch(err => console.log(err))
    },
    login: (req,res,next) => {
        const db = req.app.get('db')
        const { email, password} = req.body;
        db.check_user_exists(email).then(user => {
            if(!user[0]){
                res.status(200).send("incorrect email/password");
            } else {
                bcrypt.compare(password, user[0].user_password).then(result => {
                    if(result){
                        req.session.user = {
                            id: user[0].id,
                            email: user[0].email
                        }
                        res.status(200).send(req.session.user);
                    } else {
                        res.status(200).send("incorrect email/password");
                    }
                })
            }
        })
    }

}