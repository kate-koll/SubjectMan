const ErrorAuth = require("../errors/profiles/profiles-error.js");

const profiles={
    authorities:["1950-4989-1"],
    executives:["7576-9754-1"]
}

function resolveAuthority(ucEnv){
    let uuIdentity = ucEnv.getSession().getIdentity().getUuIdentity()
    console.log(uuIdentity)
    let output
    profiles.authorities.forEach((identity)=>{
        if(identity == uuIdentity){
            output = "Authorities"
        }
    })
    if(output === undefined){
        profiles.executives.forEach((identity)=>{
            if(identity == uuIdentity){
                output = "Executives"
            }
        })
    }
    if(output === undefined){
        output = "Public"
    }
    console.log("output: "+ output)
    return {profile: output}
}

function throwAuthError(role, permitedRole){
   
    if(permitedRole == "Executives"){
      if(role != "Authorities" && role != "Executives"){
        return {authorized: false}
      }
    }
    if(permitedRole == "Authorities" && role != "Authorities"){
      return {authorized: false}
    }
   return {authorized: true}
}

module.exports = {resolveAuthority,throwAuthError}