const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const app = express()

const PORT = 5000

app.set('view engine', 'ejs')

const storage = multer.diskStorage({
  destination:(req, file, cb) => {
    cb(null, 'public')
  },
  filename:(req, file, cb) => {
    cb(null,Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({storage})

app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res) => {
  const files = fs.readdirSync("public")
  res.render('index',{files})
})

app.post('/upload',upload.single('file'),(req,res) =>{
  res.redirect('/')
})

app.get('/delete', (req,res) => {
  const fileName = req.query.file

  if(fileName){
    fs.unlinkSync('public/${fileName}')
  }

  res.redirect('/')
})


app.listen(PORT,() => {
  console.log("App is listening on port 5000")
})
