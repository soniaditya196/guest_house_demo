const passport=require("passport");
const LocalStrategy=require('passport-local').Strategy;
const User=require('../models/user');
const Company=require('../models/company');

function SessionConstructor(userId,userGroup,details){
    this.userId=userId;
    this.userGroup=userGroup;
    this.details=details;
}
passport.serializeUser((userObject,done)=>{
    let userGroup='';
    let userPrototype=Object.getPrototypeOf(userObject);
    console.log('userPrototype: ',userPrototype);
    if(userPrototype==User.prototype){
        userGroup="guest";
    }
    else if(userPrototype== Company.prototype){
        userGroup="company";
    }
    let SessionConstructor=new SessionConstructor(userObject.id,userGroup,'');
    done(null,SessionConstructor);
});

passport.deserializeUser(async (SessionConstructor,done)=>{
    if(SessionConstructor.userGroup=="guest"){
        try{
            const user=await User.findById(SessionConstructor.userId);
            done(null,user);
        }catch(error){
            done(error,null);
        }
    }else if(SessionConstructor.userGroup=="company"){
        try{
            const user=await Company.findById(SessionConstructor.userId);
            done(null,user);
        }catch(error){
            done(error,null);
        }
    }
});

passport.use('local-user',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:false
}, async(email,password,done)=>{
    try{
        // 1) Check if the email already exists
        const user=await User.findOne({'email':email});
        if(!user){
            return done(null,false,{message:'Unknown User'});
        }
        // 2) Check if the password is correct
        const isValid=await User.comparePasswords(password,user.password);
        if (!isValid) {
			return done(null, false, { message: 'Incorrect Password' });
        }
        
		// 3) Check if email has been verified
		if (!user.active) {
			return done(null, false, { message: 'Sorry, you must validate email first' });
        }
        return done(null, user);
    }catch (error) {
		return done(error, false);
	}
}));

passport.use('local-company', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: false
}, async (email, password, done) => {
	try {
		// 1) Check if the email already exists
		const company = await Company.findOne({ 'email': email });
		if (!company) {
			return done(null, false, { message: 'Unknown User' });
		}

		// 2) Check if the password is correct
		const isValid = await Company.comparePasswords(password, Company.password);
		if (!isValid) {
			return done(null, false, { message: 'Incorrect Password' });
		}

		// 3) Check if email has been verified
		if (!company.active) {
			return done(null, false, { message: 'Sorry, you must validate email first' });
		}
		return done(null, business);
	} catch (error) {
		return done(error, false);
	}
}));
