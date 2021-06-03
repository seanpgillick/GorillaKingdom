const pg = require("pg");
const express = require("express");
const app = express();

const port = process.env.port || 3000;

app.use(express.json())
app.use(express.static("public_html"));

///////////Database/////////
var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : process.env.RDS_HOSTNAME,
    user     : process.env.RDS_USERNAME,
    password : process.env.RDS_PASSWORD,
    port     : process.env.RDS_PORT
});

connection.connect(function(err) {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }

    console.log('Connected to database.');
});

app.post("/login", function (req, res) {
    console.log(connection);
    let username = req.body.username;
    let plaintextPassword = req.body.plaintextPassword;
    

    if (!(typeof username === 'string') || !(typeof plaintextPassword === 'string') || username.length < 1 || plaintextPassword.length < 4){
        res.status(401).send();
    }

    connection.query("SELECT username FROM accountInfo WHERE username = $1", [
        username,
    ])
        .then(function (response) {
            if (!(response.rows.length === 0)) {
                // username exists
                return res.status(401).send();
            }
        })
        .catch(function (error) {
            console.log(error);
            res.status(500).send(); // server error
        });

    bcrypt
        .hash(plaintextPassword, saltRounds)
        .then(function (hashedPassword) {
            connection.query(
                "INSERT INTO accountInfo (username, hashed_password) VALUES ($1, $2)",
                [username, hashedPassword]
            )
                .then(function (response) {
                    // account successfully created
                    res.status(200).send();
                })
                .catch(function (error) {
                    console.log(error);
                    res.status(500).send(); // server error
                });
        })
        .catch(function (error) {
            console.log(error);
            res.status(500).send(); // server error
        });
});

app.listen(port, () => {
    console.log(`Listening at port: ${port}!!! :)`);
}); 

///////////////////////////

app.get('/', (req, res) => {
    res.send("Welcome to the home page")
});


//////////////////////Blackjack///////////////////////
let cards = {};
let userCards = [];
let userVals = [];
let userSum = 0;
let dealerCards = [];
let dealerVals = [];
let dealerSum = 0;

///////NEEDS TO CHANGE WITH DB////////////
let tmpBal = 100;
let betAmount = 0;

app.post("/blackjack", function (req, res) { 

    //Determine which putton the user clicked
    let action = req.body.action;
    betAmount = req.body.betAmount;

    ///////NEEDS TO CHANGE WITH DB////////////
    if (betAmount > tmpBal){
       res.status(403).json({"validBet":false}); 
    }

    let cardVals = {"A":11, "2": 2, "3": 3, "4":4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "J": 10, "Q": 10, "K": 10};
    
    if (action == "startGame"){
        userCards = [];
        userVals = [];
        userSum = 0;
        dealerCards = [];
        dealerVals = [];
        dealerSum = 0;
        
        //User has started a game
        //Need to generate and return 4 cards, 1 of the dealers card will be hidden to start.
        //Once a card as been used, remove it from the pile.
        cards = {0:"AS", 1: "2S", 2: "3S", 3: "4S", 4: "5S", 5: "6S", 6: "7S", 7: "8S", 8: "9S", 9: "10S", 10: "JS", 11: "QS", 12: "KS",
                 13:"AD", 14: "2D", 15: "3D", 16: "4D", 17: "5D", 18: "6D", 19: "7D", 20: "8D", 21: "9D", 22: "10D", 23: "JD", 24: "QD", 25: "KD",
                 26:"AH", 27: "2H", 28: "3H", 29: "4H", 30: "5H", 31: "6H", 32: "7H", 33: "8H", 34: "9H", 35: "10H", 36: "JH", 37: "QH", 38: "KH",
                 39:"AC", 40: "2C", 41: "3C", 42: "4C", 43: "5C", 44: "6C", 45: "7C", 46: "8C", 47: "9C", 48: "10C", 49: "JC", 50: "QC", 51: "KC"}

        for (let x = 3; x>=0; x--){
            let cardNum = Math.floor(Math.random() * 52);

            while (!(cardNum in cards) && Object.keys(cards).length > 0){
                cardNum = Math.floor(Math.random() * 52);
            }

            let cardVal = cards[cardNum].slice(0,-1)
            cardVal = cardVals[cardVal];

            //Users cards
            if (x >= 2){
                userCards.push(cards[cardNum]);
                userVals.push(cardVal);
                delete cards[cardNum];
            }
            else{
                dealerCards.push(cards[cardNum]);
                dealerVals.push(cardVal);
                delete cards[cardNum];
            }
        }

        let wasBlackjackHit = false;
        if ( (userVals[0] == 11 && userVals[1] == 10) || (userVals[0] == 10 && userVals[1] == 11 ) ){
            /////NEEDS TO CHANGE WITH DB/////
            tmpBal += ( Number(betAmount) * 1.5 );
            wasBlackjackHit = true;
        }
        if ( (dealerVals[0] == 11 && dealerVals[1] == 10 ) || (dealerVals[0] == 10 && dealerVals[1] == 11) ){
            /////NEEDS TO CHANGE WITH DB/////
            tmpBal -= Number(betAmount);
            wasBlackjackHit = true;
        }

        userSum = userVals.reduce((a, b) => a + b, 0);
        dealerSum = dealerVals.reduce((a, b) => a + b, 0);

        /////NEEDS TO CHANGE WITH DB/////
        let cardReturn = {"userCards": userCards, "userSum": userSum, "dealerCards": dealerCards, "dealerSum": dealerSum, "wasBlackjackHit": wasBlackjackHit, "endBalance": tmpBal, "validBet":true};
        res.status(200).json(cardReturn);
    }
    else if( action == "hit"){
        let cardNum = Math.floor(Math.random() * 52);

        while (!(cardNum in cards) && Object.keys(cards).length > 0){
            cardNum = Math.floor(Math.random() * 52);
        }
        let cardVal = cards[cardNum].slice(0,-1)
        cardVal = cardVals[cardVal];

        userCards.push(cards[cardNum]);
        userVals.push(cardVal)
        userSum = userVals.reduce((a, b) => a + b, 0);
        delete cards[cardNum];

        if (userSum > 21){
            while(dealerSum < 17){
                cardNum = Math.floor(Math.random() * 52);

                while (!(cardNum in cards) && Object.keys(cards).length > 0){
                    cardNum = Math.floor(Math.random() * 52);
                }

                cardVal = cards[cardNum].slice(0,-1)
                cardVal = cardVals[cardVal];

                dealerCards.push(cards[cardNum]);
                dealerVals.push(cardVal)
                dealerSum = dealerVals.reduce((a, b) => a + b, 0);
                delete cards[cardNum];
            }
        }

        let endBalance1 = gameResults(userSum, dealerSum, betAmount, tmpBal);
        let hitReturn = {"userCards":userCards, "userSum": userSum, "dealerCards": dealerCards, "dealerSum": dealerSum, "endBalance": endBalance1};
        res.status(200).json(hitReturn);
    }
    else if ( action = "stand"){
        while(dealerSum < 17){
            cardNum = Math.floor(Math.random() * 52);

            while (!(cardNum in cards) && Object.keys(cards).length > 0){
                cardNum = Math.floor(Math.random() * 52);
            }

            cardVal = cards[cardNum].slice(0,-1);
            cardVal = cardVals[cardVal];

            dealerCards.push(cards[cardNum]);
            dealerVals.push(cardVal)
            dealerSum = dealerVals.reduce((a, b) => a + b, 0);
            delete cards[cardNum];
        }

        let endBalance2 = gameResults(userSum, dealerSum, betAmount, tmpBal);
        let standReturn = {"dealerCards": dealerCards, "dealerSum": dealerSum, "endBalance": endBalance2};

        res.status(200).json(standReturn);
    }

    function gameResults(userSum, dealerSum, bet, balance){
        bet = Number(bet);
        balance = Number(balance);

        //Dealer Busts and Users dont - Users win
        if (dealerSum > 21 && userSum < 22){
            balance += bet;
        }
        //Both the dealer and user bust - No payout or loss
        else if(dealerSum > 21 && userSum > 21){
            balance + 0;
        }
        //The user busts but the dealer didn't - User loses
        else if(dealerSum < 21 && userSum > 21){
            balance -= bet;
        }
        //Nobody busts, user > dealer - User wins
        else if (userSum > dealerSum){
            balance += bet;
        }
        //Nobody busts, dealer > user - User loses
        else if(userSum == dealerSum){
            balance += bet;
        }
        else{
            balance -= bet;
        }
        return balance;

        //need to update the new balance into the databse
    }
});

app.get("/spin", function(req, res) {
    let resJson = {};

    for(var i = 0; i < 30; i++){
        let list = [];
        let rand1 = Math.floor(Math.random() * (5-1) + 1);
        let rand2 = Math.floor(Math.random() * (5-1) + 1);
        let rand3 = Math.floor(Math.random() * (5-1) + 1);

        list.push(rand1);
        list.push(rand2);
        list.push(rand3);

        resJson[i] = list;
    
    }
    res.status = 200;
    res.json(resJson);
});


app.post(`/pay/`, (req, res) => {
    console.log(req.body);
    console.log(req.query.bet);
    let boardArray = req.body.board;
    let bet = req.query.bet;
    let payout = 0;
    let wLines = [];

    if (checkH(boardArray, 0)){
        payout += bet*(boardArray[0][0]**2);
        wLines.push(0,1,2);
    }
    if (checkH(boardArray, 1)){
        payout += bet*(boardArray[1][0]**2);
        wLines.push(3,4,5);
    }
    if (checkH(boardArray, 2)){
        payout += bet*(boardArray[2][0]**2);
        wLines.push(6,7,8);
    }

    if (checkDr(boardArray)){
        payout += bet*(boardArray[0][0]**2);
        wLines.push(0,4,8);
    }

    if(checkDl(boardArray)){
        payout += bet*(boardArray[2][0]**2);
        wLines.push(2,4,6);
    }


    res.send({"payout": payout, "lines": wLines});
})

function checkH(arr, row){
    return ((arr[row][0] === arr[row][1]) && (arr[row][1] === arr[row][2]));

}

function checkDr(arr){
    return ((arr[0][0] === arr[1][1]) && (arr[1][1] === arr[2][2]));
}

function checkDl(arr){
    return (arr[0][2] === arr[1][1] === arr[2][0]);
}
