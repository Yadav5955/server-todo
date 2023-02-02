const express=require("express")
const app=express()
const PORT=process.env.PORT || 3005
const mongoose=require('mongoose')
const cors=require('cors')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const signupModel = require("./models/signupModel")
const ToDoModel = require("./models/todoModel")

const mongoDB='mongodb+srv://localhost:27017'
mongoose.connect(mongoDB,()=>{
    console.log('DB Connected')
})
app.listen(PORT,()=>{
    console.log(`server is up at ${PORT}`)
})
app.get('/',(req,res)=>{
    res.send('backend works')
})
app.post('/signup',async(req,res)=>{
    if(await isExtinguisher(req.body.email)){
        res.status(200).send("user exists")
    }else{
        generateHash(req.body.password).then((passwordHash)=>{
            signupModel.create({email:req.body.email,password:req.body.password}).then((data)=>{
                res.status(200).send('new user added')
            }).catch((err)=>{
                res.status(400).send(err.message)
            })
        })
    }
})
app.post('/signin',(req,res)=>{
    signupModel.find({email:req.body.email}).then((data)=>{
        if(data.length){
            bcrypt.compare(req.body.password,data[0].password).then((isMatched)=>{
            if(isMatched){
                const authToken=jwt.sign(data[0].email,process.env.SECRET_KEY)
                res.status(200).send({authToken})
            }else{
                res.status(400).send('wrong password')
            }
            }).catch((err)=>{
                console.log(err)
            })
        }else{
            res.status(400).send('user doesnt exist')
        }
    })
})
app.post('/addactivity',(req,res)=>{
    if(req.headers.authorization){
        try{
           const user=jwt.verify(req.headers.authorization,process.env.SECRET_KEY)
           console.log(user)
           ToDoModel.create({
            username:user,
            activity:req.body.activity,
            status:req.body.status,
            timetaken:req.body.timetaken,
            action:req.body.action,
            startTime:"",
            endTime:""
           }).then(()=>{
            res.status(200).send('added activity')
           }).catch((err)=>{
            res.status(400).send(err.message)
           })
        }
        catch(err){
            res.status(400).send('failed')
        }
    }else{
        res.status(200).send('not found')
    }
})
app.get('/activity',(req,res)=>{
    if(req.headers.authorization){
        try{
            const user=jwt.verify(req.headers.authorization,process.env.SECRET_KEY)
            signupModel.find({email:user}).then((userInfo)=>{
                if(userInfo.length){
                    ToDoModel.find({username:user}).then((activityInfo)=>{
                        const activity=activityInfo.reverse()
                        res.status(200).send(activity)
                    })
                }else{
                    res.status(400).send('user doesnt exist')
                }
            }).catch((err)=>{
                console.log(err)
            })
        }
        catch(err){
            res.status(400).send('authorization failed')
        }
    }else{
        res.status(200).send('not found')
    }
})
app.put('/addstarttime',async(req,res)=>{
    const startTime=new Date().getTime()
    console.log(startTime)
    await ToDoModel.findByIdAndUpdate(req.params.id,{startTime:startTime,status:"pending"},(err,docs)=>{
        if(err){
            console.log(err)
        }else{
            console.log("updated",docs)
            res.status(200).send("updated")
        }
    })
})
app.put('/addendtime',async(req,res)=>{
    try{
    const endTime=new Date().getTime()
    console.log(endTime)
    await ToDoModel.findByIdAndUpdate(req.params.id,{endTime:endTime,status:'completed'},(err,docs)=>{
        if(err){
            console.log(err)
        }else{
            console.log('updated',docs)
        }
    })
}
catch(err){
    console.log(err)
}
})