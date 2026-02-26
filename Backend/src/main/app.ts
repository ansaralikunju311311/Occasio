import express from 'express';

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.get('/',(req,res)=>{
    res.send('helooo')
})

app.use((_req,res)=>{
    res.status(404).json({message:'the page not found'})
})
export default app