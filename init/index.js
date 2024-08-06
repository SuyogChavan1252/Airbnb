const mongoose = require('mongoose');
const initData=require("./data.js");   //initData madhe key:val pair alhe object ani intidata.data mnje array samplelisting akkha
const Listing=require("../models/listing.js"); //Listing collection pn import kela

main()
.then(()=>{
    console.log("Connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB=async ()=>{
await Listing.deleteMany({}); //adicha clear ker data
initData.data=initData.data.map((obj)=>({...obj,owner:'66a5e18f97b2b9d92ca3c574'}));  // to object ahe tasa theval pn pratyek obj la owner property add keli
await Listing.insertMany(initData.data);
console.log("Data was initialized");
}

initDB();
