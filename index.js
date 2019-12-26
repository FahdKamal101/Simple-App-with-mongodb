const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/myfirstmongodb', { useNewUrlParser: true });

const Student = mongoose.model('Student', {
  name: String,
  student_id: Number,
  email: String,
  password: String,
  date_added: Date
});

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/login',  async (req, res) => {
  const body = req.body;
  console.log('req.body', body);

  const email = body.email;

  // lets check if email exists

  const result = await Student.findOne({"email":  email});
  if(!result) // this means result is null
  {
    res.status(401).send({
      Error: 'This user doesnot exists. Please signup first'
     });
  }
  else{
    // email exists
    // then match password

    if(body.password === result.password){

      // allow this user access

      console.log('match');

      res.send({message: 'Successfully Logged in'});
    }

      else{

        console.log('password doesnot match');

        res.status(401).send({message: 'Wrong email or Password'});
      }
  }

});

app.post('/signup', async (req, res) => {
  const body = req.body;
  console.log('req.body', body)
  try{
const student = new Student(body);

const result = await student.save();
res.send({
  message: 'Student signup successful'
});

}
catch(ex){
  console.log('ex',ex);
  res.send({message: 'Error'}).status(401);
}
});

app.get('/', (req, res) => {
  res.send('Welcome to my Node.js app');
});

app.get('/students', async (req, res) => {

   const allStudents = await Student.find();
   console.log('allStudents', allStudents);

  res.send(allStudents);
});

app.get('*', (req, res) => {

  res.send('Hello, this is the sign up page');
});

app.listen(3000, () => {
  console.log('Express application running on localhost:3000');
});
 




