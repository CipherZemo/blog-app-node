exports.authorizeRoles = (...roles) => {//'...' are REST parameter syntax (to accept ANY number of arguments and turn them into an array)
  return (req, res, next) => {
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
//here authorizeRoles is not exported as function. each exporting file is wrapped by node as follows
// (function (exports, require, module, __filename, __dirname) {

//    });
//module.exports is the actual object your file returns , exports is simply a shortcut pointing to the same object(exports → module.exports → {}). ie, exports.authorizeRoles() exports it as "{ validatePost: [Function] }" which is an object but not a functn. so when you'll try to use it it wont be executed. so in routes  call it as const {valid}=require(....);
//by using {} nodejs will deconsruct it and pullout the function residing in it, so functn can be executed.
