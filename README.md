# simple-e-commerce-api


Steps to setup the project

1. Download Docker from [here](https://www.docker.com/products/docker-desktop) if already don't have docker installed.

2. clone the project using either https or ssh
- with https:  git clone https://github.com/obasajujoshua31/simple-e-commerce-api
- with ssh git clone git@github.com:obasajujoshua31/simple-e-commerce-api.git

3. Create a file called .env in the root directory and copy the contents of .env.example into it and fill in your details.
 
4. Run `docker-compose up` - to start the services. This include 

- [Mongo Database](https://mongodb.com)
- [Express Api application](https://expressjs.com)

5. Start application at port 5500 and navigate to http://localhost:5500/api-docs for the API documentation

`Note: If you are starting your application in a different port, go to swagger.json and change the host to the port you are using`


6. Default client account - username `client` and password `client`
            admin account - username `admin` and password `admin`
