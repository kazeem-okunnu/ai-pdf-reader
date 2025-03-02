import { mutation } from "./_generated/server"
import { v } from "convex/values"
import { query } from "./_generated/server"

export const createUser = mutation({
    args: {
        email: v.string(),
        imageUrl: v.string(),
        userName: v.string(),
        
       
    },
    handler: async (ctx, args) => {
        //if user already exists
       const user = await ctx.db.query("users")
       .filter((query)=>query.eq(query.field("email"),args.email))
       .collect()

        if (user?.length > 0) {
            return "user already exists"
        }
        //if not , then insert new user entry
        await ctx.db.insert("users", {
            email: args.email,
            imageUrl: args.imageUrl,
            userName: args.userName,
            upgrade: false
        })
        return "inserted new user"

        

    }
})

export const userUpgradePlan = mutation({
    args:{
        userEmail:v.string()
    },
    handler:async(ctx,args) =>{
   const result = await ctx.db.query("users").filter((q)=>q.eq(q.field("email"),args.userEmail)).collect()
   if(result){
    await ctx.db.patch(result[0]._id,{upgrade:true})
    return "success"
   }
   return "error"
    }
})

export const GetUserInfo = query({
    args:{
        userEmail: v.optional(v.string()) 
    },
    handler: async (ctx,args) =>{
        if(!args.userEmail){
            return ;
        }
        const result = await ctx.db.query("users").filter((q)=>q.eq(q.field("email"),args?.userEmail)).collect()
        return result[0]
    }
})