const User = require("../models/user")

module.exports.profile = function(req, res){
    return res.render('user_profile', {
        title: 'User Profile'
    })
}


// render the sign up page
module.exports.signUp = function(req,res){
    return res.render('user_sign_up',{
        title: "Codeial | Sign Up"
    })
}

// render the sign in page
module.exports.signIn = function(req,res){
    return res.render('user_sign_in',{
        title: "Codeial | Sign In"
    })
}


//get the sign in data
module.exports.create = function(req,res){
    //TODO later
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }
    
    User.findOne({email: req.body.email},function(err,user){
        if(err){ console.log('error in finding user in signing up'); return}
        
        if(!user){
            User.create(req.body,function(err,user){
             if(err){ console.log('error in finding user in signing up'); return}
             console.log(req.body);
             return res.redirect('/users/sign-in');
            })
        }else{
             return res.redirect('/users/sign-in');

        }

        });
}

//sign in and create a session for the user
module.exports.createSession = function(req,res){

}