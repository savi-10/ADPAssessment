var request = require('request');

var idFinal =null;
var transactionID = [];
request.get('https://interview.adpeai.com/api/v2/get-task',(err,request)=>{
    if(request){
        var response = request.body;
        var responseInObj = JSON.parse(response);
        idFinal= responseInObj.id;
        // this.CompleteId = id;
        let transactions= responseInObj.transactions;
        var highAmount = 0;
        
        for(let i=0;i<transactions.length;i++){
            //transaction IDs of all transactions
            transactionID[i] = transactions[i].transactionID

            //get timestamp for all transactions
            var timestamp = transactions[i].timeStamp;

            //the transactions of last year's top earner 
            if(timestamp < 2024 && timestamp >= 2023){

                //to get the high amount
                for(var j=i+1;j<transactions.length;i++){
                    if(transactions[i].amount < transactions[j].amount){
                        highAmount= transactions[i].amount;
                        transactions[i].amount = transactions[j].amount;
                        transactions[j].amount = highAmount
                    }
                }
            }
            //last year's top earner's transactions get the transactionIDs where the type is alpha.
            if(transactions[i].type == 'alpha'){
                console.log(transactions[i].transactionID)
            }
        }
        var topEarnerEmployeename = transactions[0].employee.name;
        console.log(`Transaction details of last year\'s top earner:  Employee Name ${topEarnerEmployeename}`)
        console.log(transactions[0]);
    } 
    if(err) console.log(err);
});

setTimeout(()=>{
var transactionIDJSon = JSON.stringify(transactionID);
var transactionObject = {
    id: idFinal,
    result: transactionIDJSon
}

var transactionJSon = JSON.stringify(transactionObject);

request.post({
    url: 'https://interview.adpeai.com/api/v2/submit-task',
    body: transactionJSon,
    json: true
}, (err,response)=>{
    console.log(`Submit task response: ${response.body}`);
})
},5000)
