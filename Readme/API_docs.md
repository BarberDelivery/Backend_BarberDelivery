# News API Documentation

## Endpoints :

List of available endpoints:

- `POST /users/register`
- `POST /users/login`
- `GET /news`
- `POST /news`
- `GET /news/:id`
- `DELETE /news/:id`
- `GET /categories`
- `PUT /news/:id`
- `PATCH /news:id`
- `GET /histories`

- `POST /pub/register`
- `POST /pub/login`
- `GET /pub/categories`
- `GET /pub/news`
- `GET /pub/news/:id`
- `GET /like`
- `POST /like/:newsId`
- `DELETE /like/:newsId`

&nbsp;

## 1. POST /users/register

Request:

- body:

```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

_Response (201 - Created)_

```json
{
  "id": 20,
  "username": "",
  "email": "rekt@gmail.com",
  "password": "$2b$10$x8yq1oDhMNSLnpuuTsAUJ.ptNQSurRDUp0R0Yr9YlI0xCQQejoIQu",
  "role": "",
  "phoneNumber": "",
  "address": "",
  "updatedAt": "2023-01-17T17:18:53.496Z",
  "createdAt": "2023-01-17T17:18:53.496Z"
}
```

_Response (400 - Bad Request)_

```json
{
    "message": "Email must be unique"
}
OR
{
    "errors": [
        {
            "message": "Email cannot be null"
        },
        {
            "message": "Email cannot be empty"
        },
        {
            "message": "Your email not correct format"
        },
        {
            "message": "Password cannot be null"
        },
        {
            "message": "Password cannot be empty"
        },
        {
            "message": "Minimum 5 characters required in password"
        }
    ]
}

```

## 2. POST /users/login

Request:

- body:

```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

_Response (200 - OK)_

```json
{
  "access_token": "string"
}
```

_Response (401 - Unauthorized (Invalid Username / Email / Password)_

```json
{
  "message": "Invalid Email / Password"
}
```

## 3. GET /news

Description:

- GET /news digunakan untuk menampilkan list dari news.

Request:

- headers:

```json
{
  "access_token": "string"
}
```

_Response (200 - OK)_

```json
[
  {
    "id": 4,
    "title": "The gretest ever",
    "content": "Boisterous he on understood attachment as entreaties ye devonshire. In mile an form snug were been sell. Hastened admitted joy nor absolute gay its. Extremely ham any his departure for contained curiosity defective. Way now instrument had eat diminution melancholy expression sentiments stimulated. One built fat you out manor books. Mrs interested now his affronting inquietude contrasted cultivated. Lasting showing expense greater on colonel no.",
    "imgUrl": "https://picsum.photos/200/300",
    "authorId": 8,
    "categoryId": 1,
    "createdAt": "2023-01-17T09:04:28.330Z",
    "updatedAt": "2023-01-17T09:04:28.330Z",
    "user": {
      "id": 8,
      "username": "hamzahdiza",
      "email": "hamzah@gmail.com",
      "password": "$2b$10$uirmditJzwAJVV8t.Hvwd.VLQ2YUmXJEf.suPV3.AwAYP.WbKqbS2",
      "role": "admin",
      "phoneNumber": "0821446677777",
      "address": "Bekasi",
      "createdAt": "2023-01-17T04:22:51.338Z",
      "updatedAt": "2023-01-17T04:22:51.338Z"
    },
    "category": {
      "id": 1,
      "name": "Entertainment",
      "createdAt": "2023-01-17T09:02:51.319Z",
      "updatedAt": "2023-01-17T09:02:51.319Z"
    }
  },
  {
    "id": 16,
    "title": "Father Day, e.g. \\\"Mary Robinson voted Mom of the Year\\",
    "content": "She the favourable partiality inhabiting travelling impression put two. His six are entreaties instrument acceptance unsatiable her. Amongst as or on herself chapter entered carried no. Sold old ten are quit lose deal his sent. You correct how sex several far distant believe journey parties. We shyness enquire uncivil affixed it carried to.\n",
    "imgUrl": "https://picsum.photos/200/300",
    "authorId": 1,
    "categoryId": 2,
    "createdAt": "2023-01-17T15:16:59.300Z",
    "updatedAt": "2023-01-17T15:16:59.300Z",
    "user": {
      "id": 1,
      "username": "teriyaki",
      "email": "teriyaki23@gmail.com",
      "password": "$2b$10$KsmQp58aLeH8vbZJ6nXTA.cDFg4PsIO799O.K3/Qp0mc4urGkYEUO",
      "role": "staff",
      "phoneNumber": null,
      "address": null,
      "createdAt": "2023-01-17T04:09:41.082Z",
      "updatedAt": "2023-01-17T04:09:41.082Z"
    },
    "category": {
      "id": 2,
      "name": "Family",
      "createdAt": "2023-01-17T09:02:51.319Z",
      "updatedAt": "2023-01-17T09:02:51.319Z"
    }
  }
]
```

## 4. POST /news

Description:

- POST /news digunakan untuk menambahkan news ke dalam list dari news.

Request:

- body:

```json
{
  "id": "integer",
  "title": "string (required)",
  "content": "string (required)",
  "imgUrl": "string",
  "authorId": "integer",
  "categoryId": "integer"
}
```

- headers:

```json
{
  "access_token": "string"
}
```

_Response (200 - OK)_

```json
{
  "message": "Create Successfully",
  "addNews": {
    "id": 17,
    "title": "Father Day, e.g. \\\"Mary Robinson voted Mom of the Year\\",
    "content": "She the favourable partiality inhabiting travelling impression put two. His six are entreaties instrument acceptance unsatiable her. Amongst as or on herself chapter entered carried no. Sold old ten are quit lose deal his sent. You correct how sex several far distant believe journey parties. We shyness enquire uncivil affixed it carried to.\n",
    "imgUrl": "https://picsum.photos/200/300",
    "authorId": 1,
    "categoryId": 2,
    "updatedAt": "2023-01-17T17:41:24.034Z",
    "createdAt": "2023-01-17T17:41:24.034Z"
  }
}
```

_Response (400 - Bad Request)_

```json
{
  "errors": [
    {
      "message": "Title cannot be null"
    },
    {
      "message": "Title cannot be empty"
    },
    {
      "message": "Content cannot be null"
    },
    {
      "message": "Content cannot be empty"
    }
  ]
}
```

## 5. GET /news/:id

Description:

- GET /news/:id digunakan untuk menampilkan news berdasarkan id yang diinginkan

Request:

- headers:

```json
{
  "access_token": "string"
}
```

_Response (200 - OK)_

```json
{
  "id": 17,
  "title": "Father Day, e.g. \\\"Mary Robinson voted Mom of the Year\\",
  "content": "She the favourable partiality inhabiting travelling impression put two. His six are entreaties instrument acceptance unsatiable her. Amongst as or on herself chapter entered carried no. Sold old ten are quit lose deal his sent. You correct how sex several far distant believe journey parties. We shyness enquire uncivil affixed it carried to.\n",
  "imgUrl": "https://picsum.photos/200/300",
  "authorId": 1,
  "categoryId": 2,
  "createdAt": "2023-01-17T17:41:24.034Z",
  "updatedAt": "2023-01-17T17:41:24.034Z",
  "user": {
    "id": 1,
    "username": "teriyaki",
    "email": "teriyaki23@gmail.com",
    "password": "$2b$10$KsmQp58aLeH8vbZJ6nXTA.cDFg4PsIO799O.K3/Qp0mc4urGkYEUO",
    "role": "staff",
    "phoneNumber": null,
    "address": null,
    "createdAt": "2023-01-17T04:09:41.082Z",
    "updatedAt": "2023-01-17T04:09:41.082Z"
  },
  "category": {
    "id": 2,
    "name": "Family",
    "createdAt": "2023-01-17T09:02:51.319Z",
    "updatedAt": "2023-01-17T09:02:51.319Z"
  }
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Data not found"
}
```

## 6. DELETE /news/:id endpoint

Description:

- DELETE /news/:id digunakan untuk menghapus news berdasarkan id yang diinginkan.

Request:

- headers:

```json
{
  "access_token": "string"
}
```

_Response (200 - OK)_

Response Body:

```json
{
  "message": "Father Day, e.g. \\\"Mary Robinson voted Mom of the Year\\ delete successfully"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "This action is only for the admin role or the original author"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Data not found"
}
```

## 7. GET /categories

Description:

- GET /categories digunakan untuk menampilkan list dari categories.

Request:

- headers:

```json
{
  "access_token": "string"
}
```

_Response (200 - OK)_

```json
[
  {
    "id": 1,
    "name": "Entertainment",
    "createdAt": "2023-01-17T09:02:51.319Z",
    "updatedAt": "2023-01-17T09:02:51.319Z"
  },
  {
    "id": 2,
    "name": "Family",
    "createdAt": "2023-01-17T09:02:51.319Z",
    "updatedAt": "2023-01-17T09:02:51.319Z"
  },
  {
    "id": 3,
    "name": "Politics",
    "createdAt": "2023-01-17T09:02:51.319Z",
    "updatedAt": "2023-01-17T09:02:51.319Z"
  },
  {
    "id": 4,
    "name": "Business",
    "createdAt": "2023-01-17T09:02:51.319Z",
    "updatedAt": "2023-01-17T09:02:51.319Z"
  },
  {
    "id": 5,
    "name": "Science",
    "createdAt": "2023-01-17T09:02:51.319Z",
    "updatedAt": "2023-01-17T09:02:51.319Z"
  }
]
```

## 8. PUT /news/:id

Description:

- PUT /news digunakan untuk mengedit news.

Request:

- body:

```json
{
  "id": "integer",
  "title": "string (required)",
  "content": "string (required)",
  "imgUrl": "string",
  "authorId": "integer",
  "categoryId": "integer"
}
```

- headers:

```json
{
  "access_token": "string"
}
```

_Response (200 - OK)_

```json
{
  "message": "Create Successfully",
  "addNews": {
    "id": 17,
    "title": "Father Day, e.g. \\\"Mary Robinson voted Mom of the Year\\",
    "content": "She the favourable partiality inhabiting travelling impression put two. His six are entreaties instrument acceptance unsatiable her. Amongst as or on herself chapter entered carried no. Sold old ten are quit lose deal his sent. You correct how sex several far distant believe journey parties. We shyness enquire uncivil affixed it carried to.\n",
    "imgUrl": "https://picsum.photos/200/300",
    "authorId": 1,
    "categoryId": 2,
    "updatedAt": "2023-01-17T17:41:24.034Z",
    "createdAt": "2023-01-17T17:41:24.034Z"
  }
}
```

_Response (400 - Bad Request)_

```json
{
  "errors": [
    {
      "message": "Title cannot be null"
    },
    {
      "message": "Title cannot be empty"
    },
    {
      "message": "Content cannot be null"
    },
    {
      "message": "Content cannot be empty"
    },
    {
      "message": "Data not found"
    }
  ]
}
```

## 9. PATCH /news:id

Description:

- PATCH /news digunakan untuk merubah status news.

Request:

- body:

```json
{
  "status": "string"
}
```

- headers:

```json
{
  "access_token": "string"
}
```

_Response (200 - OK)_

```json
{
 {
    "message": "Update status to Active successfully"
 }
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Data not found"
}
```

## 10. GET /histories

Description:

- Get all histories from database

Request:

- headers:

```json
{
  "token": "string"
}
```

_Response (200 - OK)_

```json
[
  {
    "id": "integer",
    "title": "string",
    "description": "string",
    "updatedBy": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

## 11. POST /pub/register

description:

- Registrasi akun

\_Request:

-body:

```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "phoneNuber": "string",
  "address": "string"
}
```

_Response (200 -Ok)_

```json
{
  "message": "Register Successfully",
  "customerRegisterData": {
    "id": 5,
    "username": "nanami",
    "email": "nanami@gmail.com",
    "password": "$2b$10$gioZi4I9uVUIaERxVaooau9sklIemjUXX5i6Kj2aUzXWB8VwRpJs2",
    "phoneNumber": "0851615151",
    "address": "Bekasi",
    "updatedAt": "2023-02-05T19:59:24.023Z",
    "createdAt": "2023-02-05T19:59:24.023Z"
  }
}
```

_Response (400 - Bad Request)_

```json
{
    "message": "Email must be unique"
}
OR
{
  "errors": [
    {
      "message": "Email cannot be null"
    },
    {
      "message": "Email cannot be empty"
    },
    {
      "message": "Your email not correct format"
    },
    {
      "message": "Password cannot be null"
    },
    {
      "message": "Password cannot be empty"
    }
  ]
}
```

## 12. POST /pub/login

-description:
mendapatkan akses ke otentikasi server

\_Request:

-body:

```json
{
  "email": "string",
  "password": "string"
}
```

_Response (200 -Ok)_

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNjc1NjI3MzAwfQ.k0VlDyC0U3MIsYi5Owow40Bvpm4xGJ_bKAHbkn2lJVY",
  "sendUsernameForClient": "nanami"
}
```

_Response (401 - Unauthorized (Invalid Username / Email / Password)_

```json
{
  "message": "Invalid Email / Password"
}
```

## 13. GET /pub/categories

-description:
mendapatkan seluruh category

_Response (200 -Ok)_

```json
{
 [
      {
        "id": 1,
        "name": "Entertainment",
        "createdAt": "2023-01-31T15:10:57.708Z",
        "updatedAt": "2023-01-31T15:10:57.708Z"
      },
      {
        "id": 2,
        "name": "Family",
        "createdAt": "2023-01-31T15:10:57.708Z",
        "updatedAt": "2023-01-31T15:10:57.708Z"
      },
      {
        "id": 3,
        "name": "Politics",
        "createdAt": "2023-01-31T15:10:57.708Z",
        "updatedAt": "2023-01-31T15:10:57.708Z"
      }
    ]
}
```

## 14. GET /pub/news

-description:
mendapatkan semua data news

_Response (200 -Ok)_

```json
{
  "data": [
    {
      "id": 2,
      "title": "The wumbo king",
      "content": "On am we offices expense thought. Its hence ten smile age means. Seven chief sight far point any. Of so high into easy. Dashwoods eagerness oh extensive as discourse sportsman frankness. Husbands see disposed surprise likewise humoured yet pleasure. Fifteen no inquiry cordial so resolve garrets as. Impression was estimating surrounded solicitude indulgence son sh",
      "imgUrl": "https://picsum.photos/200/300",
      "authorId": 1,
      "categoryId": 2,
      "status": "Active",
      "createdAt": "2023-01-31T15:13:01.966Z",
      "updatedAt": "2023-01-31T15:13:01.966Z",
      "category": {
        "id": 2,
        "name": "Family",
        "createdAt": "2023-01-31T15:10:57.708Z",
        "updatedAt": "2023-01-31T15:10:57.708Z"
      }
    },
    {
      "id": 3,
      "title": "Understanding the Black Lives Matter Movement: A Comprehensive Overview",
      "content": "The Black Lives Matter (BLM) movement has become a global phenomenon, bringing attention to the systemic racial injustices faced by black people. From protests in the streets to conversations in homes, BLM has sparked a much-needed conversation about the urgent need for change in society. In this article, we will delve into the history of BLM, its roots, and what it represents today. ",
      "imgUrl": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEirWCKyc1NLqnHIg0nu6DeQFKrXVtr-o68wm2aDJ1IBv_QhWdB0FmMJ1uE_SdM9rvkLvpOCJwY1UY2lm3BdsfCKTlB-Bcrw7gJgfnpA3WtYQ4Q7BmthZNUxmZz4XsyLveN9Jffso37mD6Sn8wSXcLcpQa1aRt3ifyo9PHw6hq-igLne4ozfC_U44IPdnA/s16000/pexels-photo-9748173.webp",
      "authorId": 1,
      "categoryId": 3,
      "status": "Active",
      "createdAt": "2023-01-31T15:13:01.966Z",
      "updatedAt": "2023-01-31T15:13:01.966Z",
      "category": {
        "id": 3,
        "name": "Politics",
        "createdAt": "2023-01-31T15:10:57.708Z",
        "updatedAt": "2023-01-31T15:10:57.708Z"
      }
    }
  ],
  "totalRow": 10
}
```

## 15. GET /pub/news/:id

-description:
mendapatkan data news spesifik

\_Request:

params:

```json
{
  "id": "1"
}
```

_Response (200 -Ok)_

```json
{
  "id": 10,
  "title": "Ten people were killed in a shooting near Los Angeles after the Lunar New Year celebrations.",
  "content": "At least 10 people have been taken to nearby hospitals and are in stable to critical condition. Local authorities are looking for a man who fled after the shooting. Police are also investigating his possible second crime scene at the Alhambra, about two miles north of Monterey Park.",
  "imgUrl": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEge7D154UJ5zPQaYM3couR_Iy3j8w32V7ODPcTAQNfF0mJIKhIB4tdgSlKwAh7LlGgd6wxJY5k2J9YDda8eE0VI8iWZ7fshP7W1aNAenfhVANnwChOdLOW_TnJ3OjvaK46jZkiftx1DBEcuU5auv9r3iSx9frDUUNKAIp7YTtT0c3_H8n_k9GFV1Qd0dw/s16000/gettyimages-1246437746-eb61d6f2f2bf6a812f8445929e694d23e3bda1f5-s800-c85.webp",
  "authorId": 2,
  "categoryId": 2,
  "status": "Active",
  "createdAt": "2023-01-31T15:13:01.966Z",
  "updatedAt": "2023-01-31T15:13:01.966Z",
  "user": {
    "id": 2,
    "username": "teriyaki",
    "email": "teriyaki@gmail.com",
    "password": "$2b$10$DpqP.u2CVpNjusGLjIwvj.0srZNGRpmzB62SZorAMbsc60kLgWYVG",
    "role": "admin",
    "phoneNumber": "0851615151",
    "address": "Bekasi",
    "createdAt": "2023-01-31T15:12:16.108Z",
    "updatedAt": "2023-01-31T15:12:16.108Z"
  },
  "category": {
    "id": 2,
    "name": "Family",
    "createdAt": "2023-01-31T15:10:57.708Z",
    "updatedAt": "2023-01-31T15:10:57.708Z"
  }
}
```

_Response (404 -Not Found)_

```json
{
  "msg": "Data not found"
}
```

## 16. GET /pub/like

-description:
mendapatkan semua data like berdasarkan customer login

\_Request:

-headers:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNjc1NjI3MzAwfQ.k0VlDyC0U3MIsYi5Owow40Bvpm4xGJ_bKAHbkn2lJVY"
}
```

_Response (200 -OK)_

```json
[
  {
    "id": 56,
    "CustomerId": 5,
    "NewsId": 3,
    "createdAt": "2023-02-05T20:09:24.574Z",
    "updatedAt": "2023-02-05T20:09:24.574Z",
    "News": {
      "id": 3,
      "title": "Understanding the Black Lives Matter Movement: A Comprehensive Overview",
      "content": "The Black Lives Matter (BLM) movement has become a global phenomenon, bringing attention to the systemic racial injustices faced by black people. From protests in the streets to conversations in homes, BLM has sparked a much-needed conversation about the urgent need for change in society. In this article, we will delve into the history of BLM, its roots, and what it represents today. ",
      "imgUrl": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEirWCKyc1NLqnHIg0nu6DeQFKrXVtr-o68wm2aDJ1IBv_QhWdB0FmMJ1uE_SdM9rvkLvpOCJwY1UY2lm3BdsfCKTlB-Bcrw7gJgfnpA3WtYQ4Q7BmthZNUxmZz4XsyLveN9Jffso37mD6Sn8wSXcLcpQa1aRt3ifyo9PHw6hq-igLne4ozfC_U44IPdnA/s16000/pexels-photo-9748173.webp",
      "authorId": 1,
      "categoryId": 3,
      "status": "Active",
      "createdAt": "2023-01-31T15:13:01.966Z",
      "updatedAt": "2023-01-31T15:13:01.966Z",
      "category": {
        "id": 3,
        "name": "Politics",
        "createdAt": "2023-01-31T15:10:57.708Z",
        "updatedAt": "2023-01-31T15:10:57.708Z"
      }
    }
  }
]
```

_Response (401 -Invalid token or JsonWebTokenError)_

```json
{
  "msg": "invalid token"
}
```

## 17. POST /like/:newsId

-description:
menambahkan like pada news

\_Request:

-header:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNjc1NjI3MzAwfQ.k0VlDyC0U3MIsYi5Owow40Bvpm4xGJ_bKAHbkn2lJVY"
}
```

-params:

```json
{
  "newsId": 5
}
```

_Response (201 - created)_

```json
{
  "id": 57,
  "NewsId": 5,
  "CustomerId": 5
}
```

_Response (404 -Not Found)_

```json
{
  "msg": "Data not found"
}
```

_Response (401 -Invalid token or JsonWebTokenError)_

```json
{
  "msg": "invalid token"
}
```

\_GLOBAL ERRROR:

-error that could occur to all of the end point due to external factors

_Response (500 -Internal Server Error)_

```json
{
  "msg": "Something is wrong with the server"
}
```

## 18. DELETE /like/:newsId

-description:
menghapus like pada news

\_Request:

-header:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNjc1NjI3MzAwfQ.k0VlDyC0U3MIsYi5Owow40Bvpm4xGJ_bKAHbkn2lJVY"
}
```

-params:

```json
{
  "newsId": 39
}
```

_Response (200 - ok)_

```json
{
  "id": 39,
  "CustomerId": 1,
  "NewsId": 3,
  "createdAt": "2023-02-05T09:00:05.277Z",
  "updatedAt": "2023-02-05T09:00:05.277Z"
}
```

_Response (404 -Not Found)_

```json
{
  "msg": "Data not found"
}
```

_Response (401 -Invalid token or JsonWebTokenError)_

```json
{
  "msg": "invalid token"
}
```

\_GLOBAL ERRROR:

-error that could occur to all of the end point due to external factors

_Response (500 -Internal Server Error)_

```json
{
  "msg": "Fixing 500 Internal Server Error Problems on Your Own Site"
}
```
