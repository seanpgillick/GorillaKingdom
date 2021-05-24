const pg = require("pg");
const express = require("express");
const app = express();

const port = 3000;
const hostname = "localhost";

app.use(express.json())
app.use(express.static("public_html"));

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


app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});
