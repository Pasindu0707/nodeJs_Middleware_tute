const express=require('express')
const app=express()
const path=require('path')
const logEvents=require('./middleware/logEvents')
const PORT=process.env.PORT || 3500

//custom middle ware
app.use((req,res,next)=>{
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`,'reqLog.txt')
    console.log(`${req.method}\t${req.path}`)
    next()
})


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
app.get('/*',(req,res)=>{
    res.status(404).sendFile(path.join(__dirname,"views","404.html"))
})

app.listen(PORT,()=>console.log(`Running on port ${PORT}`))