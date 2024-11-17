
### Vue.js Map Application (Geo-Risk)

This project is a Vue.js application that integrates Mapbox for rendering maps and allows users to draw shapes on the map. The application uses Axios for handling HTTP requests and JSON Server to fetch GeoJSON data.

Features Interactive Map with Mapbox Shape Drawing functionality GeoJSON data fetching and rendering Backend data storage using JSON Server Setup Instructions Prerequisites


*** SAMPLE GEOJSON FORMAT IS IN THE PROJECT ROOT WITH FOLDER NAME ( SampleGeoData_TESTING )  ****

-------- Ensure you have the following installed:

Node.js (v16+ recommended)
Vue CLI
JSON Server
A Mapbox Access Token (Already integrated in the project)
Clone the Repository

### Step-1

`git clone repository-url`
then `cd repository-folder`

### Step-2 (setup/install json server for backend )

open command promt in global path using windows search (i.e path should seems like c:/users/admin) and give command
`npm install -g json-server`


### setp-3 (Start the json server)

Go to the project folder db in file explorer included in the project root that is cloned and open command promt by clicking on address bar of folder and open command promt
and give command  
`cmd`
(press enter it will open command promt)

now use command in commnd promt :  `json-server --watch db.json`

example :
E:\vue_app\usermanagementapp\db>`json-server --watch db.json`

 --- You Can use 2 seperate vscode Terminal also

### Step-4 (Start server vue-application / Install Dependencies )

in the IDE(vscode) run `npm install` in the file directory that is imported (this might will not work)

if npm install didn't work {

open power shell in global mode using powershell (i.e path seems like c:/users/admin) and give command
`Set-ExecutionPolicy RemoteSigned-scope CurrentUser`
then try
npm install

}

after npm install finishes start the server use:
`npm run serve `

The app should be accessible at http://localhost:8080
json server should be accessible at http://localhost:3000


*** SAMPLE GEOJSON FORMAT IS IN THE PROJECT ROOT WITH FOLDER NAME ( SampleGeoData_TESTING )  ****
