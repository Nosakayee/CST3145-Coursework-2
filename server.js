const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();

// config Express.js
app.use(express.json());
app.use(cors());

// Connecting to the database
var db;
const uri = "mongodb+srv://NosNos:Asabe24.@cluster0.ltty2nq.mongodb.net/";
try {
  const client = new MongoClient(uri);
  db = client.db("Webstore");
  console.log("Successfully connected to MongoDB!");
} catch (e) {
  console.error("Database connection failed. - Error:" + e);
}

// Logger Middleware
app.use((req, res, next) => {
  var log = `${req.ip} -- ${req.method} ${req.path} ${res.statusCode}"`;
  console.log(log, req.body);
  next();
});

app.get("/", async (req, res) => {
  // db.collection('lessons').updateMany({}, { $set: { avaliability: 5 } });
//   var test = await db.collection("lessons").find({}).toArray()
//   console.log(test)
  res.send("Select a collection, e.g., /collection/lessons");
});

// retrieve all the object from an collection
app.get("/collection/:collectionName", (req, res) => {
  try {
    db.collection(req.params.collectionName)
      .find({})
      .toArray()
      .then((results) => {
        res.send(results);
      });
  } catch (error) {
    console.log(error);
  }
});

// Search
app.get("/search/collection/lessons/", (req, res) => {
  try {
    var search = req.query.search;
    var sort = req.query.sort || "title";
    var order = req.query.order == "desc" ? -1 : 1;
    if (search) {
      console.log('New Search: ', search)
    }
    if (search) {
      search = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { subject: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ],
      };
    } else {
      search = {};
    }

    db.collection("lessons")
      .find(search)
      .sort({ [sort]: order })
      .toArray()
      .then((results) => {
        res.send(results);
      });
  } catch (error) {
    console.log(error);
  }
});

//to insert a document to the collection
app.post("/collection/:collectionName", (req, res) => {
  try {
    db.collection(req.params.collectionName)
      .insertOne(req.body)
      .then((results) => {
        res.send(results);
      });
  } catch (error) {
    console.log(error);
  }
});

app.get("/collection/:collectionName/:id", (req, res) => {
  try {
    db.collection(req.params.collectionName)
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((results) => {
        res.send(results);
      });
  } catch (error) {
    console.log(error);
  }
});

//to update a document by ID
app.put("/collection/:collectionName/:id", (req, res) => {
  try {
    db.collection(req.params.collectionName)
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body })
      .then((results) => {
        res.send(results);
      });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/collection/:collectionName/:id", (req, res) => {
  try {
    db.collection(req.params.collectionName)
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((results) => {
        res.send(results);
      });
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log("Express.js server running at PORT 3000");
});

console.log("testing");
// images middleware
// server.js
const axios = require('axios');


// GitHub repository details
const githubUsername = 'your-github-username';
const repositoryName = 'your-repository-name';
const branchName = 'main'; // or whichever branch your images are stored in

// Route to get images
app.get('/app/images/:id', async (req, res) => {
    const imageId = req.params.id;
    const imageUrl = `https://raw.githubusercontent.com/${githubUsername}/${repositoryName}/${branchName}/images/${imageId}`;

    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data, 'binary');
        res.writeHead(200, {
            'Content-Type': response.headers['content-type'],
            'Content-Length': response.headers['content-length']
        });
        res.end(imageBuffer);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.status(404).send('Image not found');
        } else {
            res.status(500).send('An error occurred while fetching the image');
        }
    }
});

