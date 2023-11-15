# Developing Document

## API

### /login method POST

````JSON
Requets:
{
	wechatId:String,
    gtID:String
}
Response:
{
	status:Boolean,
    content:String,
    token:String
}
````

### /getJobIndex method POST

```javascript
Requets:
{
	token:String
}
Response:
{
	status:Boolean,
    data:[
        {
            Position:String,
            CompanyName:String,
            publishDate:Date(),
            requirement:[],
            salary:String,
            type:String
        }
    ]
}
```

### /getServerTime method GET

```
Request:{}
Response:{
	time:new Date()
}
```

### /searchJob method POST

````
Request:{
	keywords:String //search key words
	token:String
}
Response:{
	status:Boolean,
	data:[
		{
            Position:String,
            CompanyName:String,
            publishDate:Date(),
            requirement:[],
            salary:String,
            type:String
        }
	]
}
````

## Data Storage Format

### Job Scheme

```JSON

{
    id:String,//job id
    CompanyName:String,
    Position:String,
    Diploma:String,
    WorkEXP:String,
    Salary:String,
    Description:String,
    Longtitude:Number,
    Latitude:Number,
    type:String //internal or offical?
    publishDate: new Date()
}
```

### User Scheme

````json
{
	id:String,//key
	wechatName:String,
    wechatImgUrl:String,//Wechat Avatar Url
	gtid:String,
	wechatID:String,
	favouriteJob:[
        String,String //jobID
    ],
    report:[ //bug report list
        String, //report ID
    ],
    type:String,//Student or stuff
}
````

### Report Scheme

```JSON
{
	id:String,//key
    reportId:String// User id
    title:String,
    content:String
}
```



## WorkFlow

### Login

![](https://img-blog.csdnimg.cn/9d4bd4b95c1d42698520cb6884225738.png)

### Index Page

![](https://img-blog.csdnimg.cn/92f4951e26cd48f7b5ae13780cff1f4e.png)

### My Page

![](https://img-blog.csdnimg.cn/56f7dd255f284d37baf19f7625fff802.png)