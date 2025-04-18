import express from 'express';

const app = express();
const PORT = process.env.PORT || 8002;

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(PORT, () => {
  console.log(`Server is running on port:- ${PORT}`);
});