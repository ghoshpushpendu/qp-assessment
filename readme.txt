To run this application 

1. install dokcer desktop on your pc 
2. Clone the repository locally 
3. Go to root direcotry and run `docker compose up -v`
4. Thats it , app should now run on http://localhost:3000

Use this postman collection to setup locally and test the apis.
[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/4607163-a19fd665-76c1-4099-b8e5-f2e7d139bd3b?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D4607163-a19fd665-76c1-4099-b8e5-f2e7d139bd3b%26entityType%3Dcollection%26workspaceId%3Dcb6977b3-f611-42b4-86ec-83887b47dcca)


Dependencies 
1. docker 
2. postgresql 

To run the test cases locally to to develop the app locally 
1. only run the postgres image and pause / delete the api image running inside docker 
2. now run the api in console by `npm run dev`
3. To test :  `npm run test`