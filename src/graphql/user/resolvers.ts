import UserService, { type LoginPayload, type UserPayload } from "../../service/user.service.js"

const query = {
  userLogin : async(_ : any, payload:LoginPayload) => {
    return await UserService.loginUser(payload);
  },

  getUser : (_:any, parameter: any, context:any) => {
    if(context && context.user && context.user.id) return context.user;
    throw new Error("User doesn't exit");
  }
}

const mutation = {
  signup : async(_:any, payload : UserPayload) => {
    return (await UserService.createUser(payload)).toString();
  }
}


export const reslovers = {query, mutation}