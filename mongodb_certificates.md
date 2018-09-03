# OpenSSL Certificate Creation mongodb

## Part 1 Generate Certificate Authority

Create the root certificate authority. The root-ca is used to sign certificates and should be kept private.
```
cd /etc/ssl
sudo mkdir mongodb
cd mongodb
```
```
sudo openssl genrsa -out ca.key 2048
```
or for password protrected run.
```
sudo openssl genrsa -des3 -out ca.key 2048
```
The next step is to self sign the ca.
```
sudo openssl req -x509 -new -nodes -key ca.key -sha256 -days 1024 -out ca.pem
```
The command will prompt a self sign interactive script.
```
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
Country Name (2 letter code) [AU]:US
State or Province Name (full name) [Some-State]:Oregon
Locality Name (eg, city) []:Portland
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Overlords
Organizational Unit Name (eg, section) []:IT
Common Name (eg, YOUR name) []:Data Center Overlords
Email Address []:none@none.com
```
Once done, this will create an SSL certificate called ca.pem, signed by itself, valid for 1024 days, and it will act as our root certificate.

## Part 2 Create Server Certificate
Here we are creating a certifcate to enable and verify ssl encryption. 
```
sudo openssl genrsa -out server.key 2048
```
#### Important!!! In the next step you’ll be asked various questions (Country, State/Province, etc.). Answer them how you see fit. The important question to answer though is common-name or CN. The CN value should be the public ipaddress or hostname of the remote db server. 

```
sudo openssl req -new -key server.key -out server.csr
```
```
sudo openssl x509 -req -in server.csr -CA ca.pem -CAkey ca.key -CAcreateserial -out server.crt -days 500 -sha256
```
```
sudo bash -c 'cat server.key server.crt > server.pem'
```
## Part 3 Create Client Certificate
```
sudo openssl genrsa -out client.key 2048
```
#### NOT Important!!! In the next step you’ll be asked various questions (Country, State/Province, etc.). Answer them how you see fit, CN can be your name.
```
sudo openssl req -new -key client.key -out client.csr
```
```
sudo openssl x509 -req -in client.csr -CA ca.pem -CAkey ca.key -CAcreateserial -out client.crt -days 500 -sha256
```
```
sudo bash -c 'cat client.key client.crt > client.pem'
```

## Part 4 Enable ssl on mongdb
```
sudo nano /etc/mongodb.conf
```
For yaml type configuration file the syntax is listed below.
```
net:
  port:27017
  bindIp: 127.0.0.1
  ssl:
    mode: requireSSL
    PEMKeyFile: /etc/ssl/server.pem
    CAFile: /etc/ssl/ca.pem
```
For older configuration file format.
```
sslMode = requireSSL
sslPEMKeyFile = /etc/ssl/mongodb/server.pem
sslCAFile = /etc/ssl/mongodb/ca.pem
```
```
sudo service mongodb restart
```
```
sudo service mongdb status
```
If done correctly mongodb should be set to active.
 ## Part 5 Test
```
mongo --ssl --sslPEMKeyFile /etc/ssl/mongodb/client.pem --sslCAFile /etc/ssl/mongodb/ca.pem --host <remote address>
```