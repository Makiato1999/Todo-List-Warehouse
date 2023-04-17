# Todo-List-Warehouse
Welcome to your personal To-do List Warehouse! Here, you can view all the lists that you have saved on this page, and you can also add, modify, or delete them as you please. So, let's start creating your very own customized plans with this convenient tool!
<br>
欢迎来到你的个人待办事项清单仓库! 在这里，你可以查看你保存在这个页面上的所有清单，你也可以随意添加、修改或删除它们。所以，让我们开始用这个方便的工具来创建你自己的定制计划吧!

### demo
<img src="demo/login.png"  width="650" height="400">
<img src="demo/signup.png"  width="650" height="400">
<img src="demo/home.png"  width="650" height="400">
<img src="demo/create.png"  width="650" height="400">
<img src="demo/list.png"  width="650" height="400">


## How to access this app
Access this app by [link](https://shielded-plains-26704.herokuapp.com/)
- current issue
if you access this app by using Google browser, Google will push a warning that 'Deceptive site ahead', since this is only a simple project, i haven't consider the cyber security factors in it, so this warning is normal 
- solution
you can choose to ignore the warning and insist on visiting this site, or you can try other browsers, such as Firefox. However, remember not to use real personal information, as I have not made any security protection for this project

## How to run this app on local server and local database
1. create connection to local database
    ```
    mongod --config /usr/local/etc/mongod.conf
    ```
2. run this app on local server with port 3000
    ```
    node app.js
    ```
3. access this app by the url
    ```
    http://localhost:3000/
    ```
4. more installation, running walkthrough and details you can see my notes
    - 
