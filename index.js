import express from 'express'
const app= express();
import logger from "./logger.js";
import morgan from "morgan";

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

const PORT=3000;

let teas=[]
let id=1
app.use(express.json())

app.post('/teas',(req,res)=>{
    const {name,price}= req.body
    const tea= {id:id++,name,price}
    teas.push(tea);
    res.status(201).send(tea)
    console.log(teas);
})

app.get('/teas',(req,res)=>{
    res.status(200).send(teas);
})

app.get('/teas/:id',(req,res)=>{
   const te= teas.find(t=>
        t.id===parseInt(req.params.id)
    )
    if(!te)
    {
        res.status(404).send("tea not found buddy!")
    }
    res.status(200).send(te);
})
app.put('/teas/:id',(req,res)=>{
   const te= teas.find(t=>
        t.id===parseInt(req.params.id)
    )
    if(!te)
    {
        res.status(404).send("tea not found buddy!")
    }
    const {name,price}= req.body
    te.name= name;
    te.price= price;
    res.status(200).send(`updated successfully`);
})

app.delete('/teas/:id',(req,res)=>{
   const index= teas.findIndex(t=>
        t.id===parseInt(req.params.id)
    )
    if(index===-1)
    {
        res.status(404).send("tea not found buddy!")
    }
    teas.splice(index,1);
    res.status(200).send(`deleted successfully`);
})

app.listen(PORT,()=>{
    console.log(`Port is listening on Port No:-${PORT}`)
})