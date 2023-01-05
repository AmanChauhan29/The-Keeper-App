import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const app = express()
// app.use(express.urlencoded())
app.use(express.json())
app.use(cors())



mongoose.set('strictQuery', false);

mongoose.connect("mongodb://127.0.0.1:27017/mykeeperAppDB", {useNewUrlParser: true, useUnifiedTopology: true}, () => console.log("DB connected"))

const keeperSchema = mongoose.Schema({
    title: String,
    description: String
})

const Keeper = new mongoose.model("Keeper", keeperSchema)


app.get("/api/getAll", (req, res) => {
    Keeper.find({}, (err, keeperList) => {
        if(err){
            console.log(err)
        } else {
            res.status(200).send(keeperList)
        }
    })
})

app.post("/api/addNew", (req, res) => {
    const { title, description } = req.body
    const keeperObj = new Keeper({
        title,
        description
    })
    keeperObj.save( err => {
        if(err){
            console.log(err)
        }
        Keeper.find({}, (err, keeperList) => {
            if(err){
                console.log(err)
            } else {
                res.status(200).send(keeperList)
            }
        })
    })

})

app.post("/api/delete", (req, res) => {
    const { id } = req.body
    Keeper.deleteOne({ _id: id}, () => {
        Keeper.find({}, (err, keeperList) => {
            if(err){
                console.log(err)
            } else {
                res.status(200).send(keeperList)
            }
        })
    })

})

// server production assests
if(process.env.NODE_ENV=== "production"){
    app.use(express.static(path.join("frontend/build")))
    app.get("/",(res,req)=>{
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    })
}

app.listen( 3001, () => {
    console.log("Backend created at port 3001")
})