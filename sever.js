const express=require('express')
const app=express()
const path=require('path')
const cors=require('cors')
const {logger}=require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const PORT=process.env.PORT || 3500

//custom middle ware
app.use(logger)

//cors
const whiteList=["http:127.0.0.1:5500","http://localhost:3500","https://www.google.com"]
const corsOption={
    origin:(origin,callback)=>{
        if(whiteList.indexOf(origin)!==-1 || !origin ){
            callback(null,true)
        }
        else{
            callback(new Error("Not allowed by CORS"))
        }
    },
    optionsSuccessStatus:200
}
app.use(cors(corsOption))


//adding middle ware

app.use(express.urlencoded({extended:false}))//to get form data to res body

app.use(express.json()) //to get json data

app.use(express.static(path.join(__dirname,'/public'))) //to serve static files


app.get("^/$|index(.html)?",(req,res)=>{
    res.sendFile(path.join(__dirname,'views','index.html'))
})

app.get('/new-page(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,"views","new-page.html"))
})

//route handling 
const one =(req,res,next)=>{
    console.log("one")
    next()
}
const two=(req,res,next)=>{
    console.log("Two")
    next()
}
const three=(req,res)=>{
    console.log("Three")
    res.send("Finished")
}

app.get('/chain(.html)?',[one,two,three])


//redirecting
app.get('/old-page(.html)?',(req,res)=>{
    res.redirect(301,"new-page.html")
})

//404
app.all('*',(req,res)=>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,"views","404.html"))
    }
    else if(accepts('json')){
        res.json({Error:"404 Not Found"})
    }
    else{
        res.type('txt').send("Not Found 404")
    }
})

app.use(errorHandler)

app.listen(PORT,()=>console.log(`Running on port ${PORT}`))