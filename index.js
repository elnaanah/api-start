const express = require('express');
const app = express();
const port = 3000;

app.get('/api', (req,res)=>{
    res.send('Hello World');
    res.status(200).json({message: 'Hello World'})
})

app.put('/add', (req,res)=>{
    res.send('Data added');
    res.status(200).json({message: 'Data added'})
})

app.listen(port, ()=>{
    console.log(`Server is running on port http://localhost:${port}`);
})

