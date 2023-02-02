const redis = require('redis')
const express = require('express')

const app = express()
const port = 3002

const redisClient = redis.createClient()

// const client = (async()=>{
//   await redisClient.connect()
// })()

redisClient.connect()

redisClient.on('ready', ()=>{
  console.log("Connected");
})

redisClient.on('error', (error)=>{
  console.log("error", error);
})

app.listen(port)

app.get('/home', async(req,res)=>{
  let parentKey = "parent"
  let keyName= "normalKey"
  let getCachedData = await redisClient.hGet(parentKey,keyName)
  let allCachedData =  await redisClient.hGetAll(parentKey)
  
  let result = {
    id: 12,
    name :  "ayush"
  }
  let data;
  if(allCachedData){
    data = (allCachedData)
    console.log("get cache");
  }else {
    console.log("set cache");
    await redisClient.hSet(parentKey,keyName,JSON.stringify(result))
    data = result
     
  }
  redisClient.DEL(parentKey)
  return res.send(data)
})
