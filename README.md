<p align="center">
 <img width="70%" src="public/form/images/logo-light.svg" />
</p>

-------------------------------------------------------------------------------------------------------------------------------------------------------


<p align="center">
  <em>
    JavaScript
    · Node JS
    · Express
  </em>
  <br />
  <em>
    API
    · JSON
    · mysql2
  </em>
  <br />
  <em>
    HTML
    · CSS
    · Handlebars
  </em>
  <br />
  <em>
    Cookies
    · JsonWebToken
  </em>
  <br />
  <em>
    <a href="https://github.com/8-bit-souvik/Securit-secure-logging-system">
      Your favorite tool?
    </a>
  </em>
</p>

<p align="center">
 <img src="https://img.shields.io/badge/file%20count-56-yellow" /> 
 <img src="https://img.shields.io/badge/lines%20count-2860-brightgreen" /> 
 <img src="https://img.shields.io/badge/repo%20size-5.4MB-blue" />
 <img src="https://img.shields.io/github/last-commit/8-bit-souvik/Securit-secure-logging-system" /> 
 </p>

## Intro

[SecurIt](https://github.com/8-bit-souvik/Securit-secure-logging-system) is a Node JS appllication
to build a demo of secure logging system as an essential backend part of any user interactable web application.

<br/>

main dependencies for this application:

- express
- express-handlebars
- mysql2
- jsonwebtoken
- nodemailer

rest of them auxiliary dependencies are:

- cookie-parser
- cors
- dotenv
- sha.js
- uuid

<br/>
<br/>

## snapshots

<p align="center">
  <img width="90%" src="https://i.ibb.co/VLWL1gj/image.png" />

<br/>
  <img width="40%" src="https://i.ibb.co/WGGMkQ6/image.png" />
  <img width="40%" src="https://i.ibb.co/YcvRTPd/image.png" />
&nbsp; &nbsp;  &nbsp; <img width="20%" src="https://i.ibb.co/2qmm0Ng/image.png" alt="dashboard"/> &nbsp;
<img width="20%" src="https://i.ibb.co/426wLr1/image.png" alt="navigation bar"/> &nbsp;
<img width="20%" src="https://i.ibb.co/4dWzHCF/image.png" alt="settings"/> &nbsp;
<img width="20%" src="https://i.ibb.co/vdXsXKq/image.png" alt="options"/>
</p>

<br/>
<br/>

# environment setup

## Database Building

as mySql is used as database therefore install mySQL for your system (if not installed) and <b> create a password to access your database.</b><br/>
decide a name for your database and a name for table that will contain inside it. <br/>
i.e: database will be `securit` and table `users`.<br/>
to build the database, run this query in mysql CLI-
```
CREATE DATABASE securit;
CREATE TABLE users (
username VARCHAR(45) NOT NULL PRIMARY KEY,
password VARCHAR(45) NOT NULL,
ID VARCHAR(45) NOT NULL,
email VARCHAR(45) NOT NULL,
active TINYINT(1) NOT NULL DEFAULT 0,
name VARCHAR(45) NOT NULL,
OTP VARCHAR(45) NULL,
OTP_timestamp INT NULL,
OTP_attempt TINYINT NULL,
password_attempt TINYINT NULL);
```

## dotenv file creation

In this dotenv file all keys and credentials for this web app will be stored.<br/>
first things first, create a file named `.env` at the root of the directory, then fill these data
```
PORT='5510'
JWT_token='<create a token>'*
DB_HOST='<hostname>'**
DB_USER='root'
DB_PASS='<enter mysql password>'
DB_NAME='securit'***
MAIL_HOST='<smtp.example.com>'****
MAIL_USER='<no-reply@example.com>'*****
MAIL_PASS='<enter email app password>'******
```

 *create a strong key for <b>JSON Web Token</b>. e.g "se8r5g4t5GB5DF4BgdHd8g7er56wA5D65W6465SA4F654" <br/>
 **type hostname, for local host type 127.0.0.1 <br/>
 ***enter database's name which has been created. as we decided our database name is securit <br/>
 ****enter email host name of which service you're using to send email to users. e.g if you're using your gmail account for this then type 'smtp.gmail.com' <br/>
 *****enter email ID from where email will be sent <br/>
 ******enter app password for email server. <br/>
<i><b><b>Tip:</b> to use gmail as sender generate app password.<br/>
go to the link account.google.com, then go to the security section.<br/>
enable 2-step verification feature. an 'App password' feature will be visible just behind 2-step verification option.<br/>
generate a key by selecting app: mail and your device </b></i> <br/>

## NPM package installation

Install <b>Node JS</b> to run this program in server side.
open a terminal and go to it's root directory. <br/>
type `npm install` to install all NPM libraries mentioned in package.json as dependencies

## Run this app

environment setup is completed.<br/>
now start the server by running `npm start`<br/>
go to the browser and type URL `localhost:5510`<br/>

<br/>
<br/>
<br/>

<b>for any kind of problem or queries contact me </b>
