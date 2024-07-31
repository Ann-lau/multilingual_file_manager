const express = require('express')
const app = express()

const PORT = 5000

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res) => {
  res.render('index')
})


app.listen(PORT,() => {
  console.log("App is listening on port 5000")
})
