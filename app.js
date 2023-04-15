//jshint extension: 6
/*
    initialize packages
*/
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const validator = require('validator');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const introduction_en = "Welcome to your personal To-do List Warehouse! Here, you can view all the lists that you have saved on this page, and you can also add, modify, or delete them as you please. So, let's start creating your very own customized plans with this convenient tool!";
const introduction_cn = "欢迎来到你的个人待办事项清单仓库! 在这里，你可以查看你保存在这个页面上的所有清单，你也可以随意添加、修改或删除它们。所以，让我们开始用这个方便的工具来创建你自己的定制计划吧!";
/*
    connect to database
*/
db_init().catch(err => console.log(err));
async function db_init() {
    try {
        await mongoose.connect('mongodb://localhost:27017/todolistDB', {useNewUrlParser: true});
    } catch (error) {
        console.error(error);
    }
}
/*
    item structure
*/
const itemSchema = new mongoose.Schema({
    item: String
});
const Item = mongoose.model("Item", itemSchema);
/*
    list structure
*/
const listSchema = new mongoose.Schema({
    created_by : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    description: String,
    items: [itemSchema]
});
const List = mongoose.model("List", listSchema);
/*
    account structure
*/
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    lists: [listSchema]
});
const User = mongoose.model("User", userSchema);





app.get("/", (req, res)=>{
    res.render("login");
});
app.post("/login", async (req, res)=>{
    let email = req.body.email;
    let foundUser = await User.findOne({ email: email}).exec();
    if (!foundUser) {
        res.render("login", { error: "This account doesn't exist! Try to sign up" });
    } else {
        res.redirect("/home/"+foundUser._id);    
    }
});
app.get("/home/:userID", async (req, res)=>{
    let userID = req.params.userID;
    let foundUser = await User.findOne({ _id: userID}).exec();
    res.render("home", {
        user: foundUser,
        introduction: {
            en: introduction_en,
            cn: introduction_cn
        }
    });    
});
app.get("/signup", (req, res)=>{
    res.render("signup");
});
app.post("/signup", async (req, res)=>{
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let confirm_password = req.body.confirm_password;
    let foundUser = await User.findOne({ email: email}).exec();

    if (password === confirm_password && !foundUser) {
        try {
            let newUser = new User({
                name: name,
                email: email,
                password: password
            });
            await newUser.save();
            res.redirect("/");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error in mongoose model api findOne() or save()");
        }
    } else {
        if (password !== confirm_password) {
            res.render("signup", { error: "Your confirm password is not same as your password! Try again" });
        } else if (foundUser) {
            res.render("signup", { error: "This email has been signed up! Try another one" });
        }
    }
});

app.get("/create/:userID", async (req, res)=>{
    let userID = req.params.userID;
    let foundUser = await User.findOne({ _id: userID}).exec();
    res.render("create", {
        user: foundUser
    });
});
app.post("/create/:userID", async (req, res)=>{
    let userID = req.params.userID;
    let listTitle = req.body.title;
    let listDescription = req.body.description;
    let foundUser = await User.findOne({ _id: userID}).exec();

    let list = new List({
        created_by: userID,
        title: listTitle,
        description: listDescription 
    });
    await foundUser.lists.push(list);
    await foundUser.save();

    res.redirect("/home/"+userID);
});

app.get("/list/:listID", async (req, res)=>{
    let listID = req.params.listID;
    let foundUser = await User.findOne(
        {"lists._id": listID},
        {"lists.$": 1}
    ).exec();
    let foundList = foundUser.lists[0];
    res.render("list", {
        list: foundList
    });
});
app.post("/list/:listID", async (req, res)=>{
    let itemContent = req.body.inputNewItem;
    let listID = req.params.listID;

    if (itemContent !== '') {
        let newItem = new Item({
            item: itemContent
        });

        let foundUser = await User.findOne({"lists._id": listID});
        let foundList = foundUser.lists.find(list => list._id == listID);
        foundList.items.push(newItem);

        await foundUser.save();
        res.redirect('/list/'+listID);
    }
});


/*
app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server is running on port 3000");
});
*/
app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
});
