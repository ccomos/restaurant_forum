# Restaurant Forum

## Features
 - 使用者需進行註冊、登入後進行使用
 - 使用者可以瀏覽餐廳資訊(待更新)
 - admin user可以新增、修改、刪除餐廳資訊
 - admin user可以修改或取消user後台使用權限

## How to use
1.開啟終端機(Terminal)至要存放專案的本機位置並執行

```
git clone https://github.com/ccomos/restaurant_forum.git
```

2.初始

```
cd restaurant_forum  //切至專案資料夾
```

```
npm install  //安裝套件
```

3.建立.env 於restaurant_forum專案資料夾

[Click here](https://github.com/ccomos/restaurant_forum/blob/master/.env.example) to find .env example

4.建立seeders
```
npx sequelize db:seed:all
```

5.開啟程式

```
npm run start //執行程式, 成功執行下會出現 
'App is listening on port 3000!'
```

5.於任一瀏覽器網址列輸入 [http://localhost:3000](http://localhost:3000) 進行瀏覽

## 測試用登入帳號
- admin user：
  email: root@example.com
  password: 12345678

- user：
  email: user1@example.com
  password: 12345678

## Tooling
- Node.js
- express
- passport
- mySQL2
- sequelize
- sequelize-cli

