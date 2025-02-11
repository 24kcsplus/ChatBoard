拼好码写麻了

今天只能先写这么多了，后面还会在github更新的，不过大概不会想着审计新的代码吧

虽然写不完，但先说说大概的目录结构：

```
/ChatBoard
  |
  |--/src
      |
      |--/api/auth
        |
        |--login_status.php // 登录状态管理
        |--logout.php // 注销管理
      |
      |--/css
        |
        |-- message_style.css  // 前端关于留言部分的样式表
      |
      |--/js //前端部分的js,有负责发送请求的部分
         |
         |-- forgot.js // 忘记密码的js部分，暂未实现请求功能
         |-- login.js // 登录页面的前端部分，前后端数据还要考虑加密传输
         |-- message.js // index和person中的功能，未完全实现
         |-- register.js // 注册页面的前端部分，为防止爆破应加上人机验证
         |-- reset.js // 重置密码的界面，暂未实现请求功能
     |
     |--/pages // 前端对应的html
         |
         |-- index.html // 首页，有留言部分
         |-- person.html // 用户详情界面
         |-- login.html // 登录界面
         |-- register.html // 注册界面
         |-- reset.html // 重置密码界面
         |-- forgot.html // 忘记密码界面
     |
     |-- index.php // 首页的后端部分，暂未完成
     |-- login.php // 登录的后端部分，已完成
     |-- register.php // 注册的后端部分，已完成
     |-- db.php // 连接数据库的部分
     |-- config.php // 数据库的连接信息
     |-- forgot.php // 忘记密码的后端部分，需要发送邮箱，还得防止爆破，未完成
     |-- reset.php // 重置密码的后端部分，未完成
     |-- person.php // 个人信息页的后端部分，未完成，应包含修改密码，拉黑，显示历史留言，上传头像等功能，上传功能还要注意安全性
 |
 |-- init.sql // 数据库初始化，缺少users表的部分
 |-- .htaccess // 目录配置文件
 |-- docker-compose.yml // docker部署文件
 |-- Dockerfile
 |-- php.ini // 确保有所需插件
 |-- README.md // 说明文件
 
```

选择了前后端分离，加之对js不熟悉，家里有变故，开工晚，导致了逾期

如果学长们有空的话也可以看看[仓库](https://github.com/24kcsplus/ChatBoard)

config.php和docker部署的部分应记得改对应的信息，仓库中的信息仅供测试使用，注意信息安全

搞前后端分离应该把页面和接口彻底分离的，但是已经写了这么多了。。