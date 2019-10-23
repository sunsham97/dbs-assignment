// Variables used

// forexPairs object contains all the data related to forex currency pair in the form of
// key value mapping, where key is the currency pair name and the value is the related object
const forexPairs = {}
// midPrices object contains the midPrices of all the currency pairs over the last 30s, stored
// in the form of key value mapping, where key = currency pair, and the value is the value 
// of midPrices calculated over the last 30s
const midPrices = {}

// function to update midprice of an individual pair
// accepts forex pair name as parameter
function updateMidPrice(pair) {
  if (midPrices[pair].length >= 30) midPrices[pair].shift();
  midPrices[pair].push((forexPairs[pair].bestBid+forexPairs[pair].bestAsk)/2);
}

// function to update midprices of all the forex pairs, along with pair who got updated
// accepts new/updated object as an argument
function updateAllMidPrices(data) {
  if (data.name in midPrices) updateMidPrice(data.name)
  else midPrices[data.name] = [(data.bestBid+data.bestAsk)/2];
  
  for (let pair in midPrices) {
    if (pair !== data.name) updateMidPrice(pair)
  }

}


// function to update the sparkline
function updateSparkLine() {
  for (let index in midPrices) {
    const spark = document.getElementById(index);
    Sparkline.draw(spark,midPrices[index])
  }
}

// function to create the dynamic row of forex table
function createRow(data) {
  return "<tr>"+
          "<td>"+data.name+"</td>"+
          "<td>"+data.bestBid+"</td>"+
          "<td>"+data.bestAsk+"</td>"+
          "<td>"+data.lastChangeBid+"</td>"+
          "<td>"+data.lastChangeAsk+"</td>"+
          "<td><span id="+data.name+"></span></td>"+
        "</tr>";
}

// function to sort and update the forex table
function updateTable() {
  let arr = Object.values(forexPairs);
  arr = arr.sort(function(a,b){
    return a.lastChangeBid - b.lastChangeBid;
  });
  let tableBody = document.getElementById('forex-pairs');
  let tableContent = "";
  for (pair of arr) {
    tableContent += createRow(pair);
  }
  tableBody.innerHTML = tableContent;
  updateSparkLine();
  return true;
}

// function to update forex pair
function updatePair(data) {
    forexPairs[data.name] = data;
}

module.exports.updateAllMidPrices = updateAllMidPrices;
module.exports.updateTable = updateTable;
module.exports.updatePair = updatePair;