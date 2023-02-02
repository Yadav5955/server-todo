const signupModel=require('./models/signupModel')
const bcrypt=require('bcryptjs')
const { promise } = require('bcrypt/promises')
const isExtinguisher=async(email)=>{
    let extinguisher=false
    await signupModel.find({email:email}).then((data)=>{
        if(data.length){
            extinguisher=true
        }
    })
    return extinguisher
}
const generateHash=async(email)=>{
    const salt=10
    return promise((resolve,reject)=>{
        bcrypt.genSalt((salt).then((saltHash)=>{
            bcrypt.hash(password,saltHash).then((passwordHash)=>{
                resolve(passwordHash)
            })
        }))
    })
}
module.exports={isExtinguisher,generateHash}