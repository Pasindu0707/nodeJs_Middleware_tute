const path=require('path')
const {format}=require('date-fns')
const {v4:uuid}=require('uuid')
const fs=require('fs')
const fspromises=require('fs').promises

const logEvent=async(msg,logFilePath)=>{

    const date=`${format(new Date(),'yyyy/MM/dd\tHH/mm/ss')}`
    const massage= `${date}\t${uuid()}${msg}\n`
    

    try{
    if(!fs.existsSync(path.join(__dirname,'..','Logs'))){
        await fspromises.mkdir(path.join(__dirname,'..','Logs'))
    }

    await fspromises.appendFile(path.join(__dirname,'..','Logs',logFilePath),massage)
    }catch(err){
        console.error(err)
    }
}

module.exports=logEvent