const express = require('express');
const app = express();
const port = 3000;

app.get('/api', (req,res)=>{
    res.send('Hello World');
    res.status(200).json({message: 'Hello World'})
})

app.listen(port, ()=>{
    console.log(`Server is running on port http://localhost:${port}`);
})

