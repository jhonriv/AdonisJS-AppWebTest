const InvalidAccess = use('App/Exceptions/InvalidAccessException');
const NotFound = use('App/Exceptions/NotFoundException');

class VerificationsService{
    VerificationAuth(resource, user){
        if (!resource){
            console.log("!resource");
            throw new NotFound();
        }

        if (resource.user_id !== user.id){
            console.log("InvalidAccess");
            throw new InvalidAccess();
        }
    }
    
}

module.exports = new VerificationsService