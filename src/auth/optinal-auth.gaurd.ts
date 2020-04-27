import { AuthGuard } from '@nestjs/passport';
export class OptionalAuthGaurd extends AuthGuard('jwt'){
    handleRequest(err, user, info, context){
        return user
    }
}