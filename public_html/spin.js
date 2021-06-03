let spin = document.getElementById("spin");

let iTen = document.createElement("img");
iTen.src = "symbols/ten.png";
iTen.dataValue = 1;
iTen.id = "ten";

let iPlum = document.createElement("img");
iPlum.src = "symbols/plum.png";
iPlum.dataValue = 2;
iPlum.id = "plum";

let iLemon = document.createElement("img");
iLemon.src = "symbols/lemon.png";
iLemon.dataValue = 3;
iLemon.id = "lemon";

let iDiamond = document.createElement("img");
iDiamond.src = "symbols/diamond.png";
iDiamond.dataValue = 4;
iDiamond.id = "diamond";

spin.addEventListener("click", function(){
    let bet = document.getElementById("bet").value;

    fetch('/spin')
    .then(response => response.json())
    .then(async function(data){
        console.log(data);
        let size = Object.keys(data).length;
        for(var x = 0; x < 3; x++) {
            let runT = Math.floor(Math.random() * ((size*2) - size) + size);
            for (var i = 0; i < runT; i++){
                let top = i;
                let mid;
                let bot;
                if (i >= size) {
                    if (i >= (size*2)){
                        top = i - (size*2);
                    }
                    else {
                        top = i - size;
                    }
                }

                mid = top - 1;
                bot = top - 2;

                if(mid < 0){
                    mid = size + mid;
                }

                if(bot < 0){
                    bot = size + bot;
                }

                if (x === 0) {
                    document.getElementById("0").append(findImg(data[top][x]));
                    document.getElementById("1").append(findImg(data[top][x+1]));
                    document.getElementById("2").append(findImg(data[top][x+2]));
                    document.getElementById("3").append(findImg(data[mid][x]));
                    document.getElementById("4").append(findImg(data[mid][x+1]));
                    document.getElementById("5").append(findImg(data[mid][x+2]));
                    document.getElementById("6").append(findImg(data[bot][x]));
                    document.getElementById("7").append(findImg(data[bot][x+1]));
                    document.getElementById("8").append(findImg(data[bot][x+2]))
                }

                else if (x === 1) {
                    document.getElementById("1").innerText = data[top][x];
                    document.getElementById("2").innerText = data[top][x+1];
                    document.getElementById("4").innerText =  data[mid][x];
                    document.getElementById("5").innerText = data[mid][x+1];
                    document.getElementById("7").innerText = data[bot][x];
                    document.getElementById("8").innerText = data[bot][x+1];
                }

                else {
                    document.getElementById("2").innerText = data[top][x];
                    document.getElementById("5").innerText = data[mid][x];
                    document.getElementById("8").innerText = data[bot][x];
                }
                await sleep(50);
            }
        }
        console.log(bet);

        let responseArr = [
                            [document.getElementById("0").innerText, document.getElementById("1").innerText, document.getElementById("2").innerText],
                            [document.getElementById("3").innerText, document.getElementById("4").innerText, document.getElementById("5").innerText],
                            [document.getElementById("6").innerText, document.getElementById("7").innerText, document.getElementById("8").innerText]
                        ];

        let board = { "board": responseArr };

        fetch(`/pay/?bet=${bet}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
                            
            body: JSON.stringify(board),
        })
        .then(response => response.json())
        .then(async function(data){
            console.log(data)
            document.getElementById("payout").innerText = data.payout;
            if(data.payout > 0) {
                let symbol = document.getElementById(data.lines[0]).innerText;
                for(var x = 0; x < 10; x++){
                    for(var i = 0; i < data.lines.length; i++){
                        document.getElementById(data.lines[i]).innerText = "X";
                        await sleep(100);
                        document.getElementById(data.lines[i]).innerText = symbol;
                    }
                }
            }
        })
        .catch((error) => {
            console.error('Error', error);
        })
    })
    .catch((error) => {
        console.error('Error:', error);
    })
});

function findImg(num) {
    if (num === document.getElementById("ten").getAttribute("data-value")) {
        return document.getElementById("ten");
    }
    
    if (num === document.getElementById("plum").getAttribute("data-value")) {
        return document.getElementById("plum");
    }
    
    if (num === document.getElementById("lemon").getAttribute("data-value")) {
        return document.getElementById("lemon");
    }
    
    if (num === document.getElementById("diamond").getAttribute("data-value")) {
        return document.getElementById("diamond");
    }
    
    return "yee";
}

function createTable(rows, cols) {
    let tables = document.getElementById("game-container");
    let tabObj = document.createElement("table");
    tabObj.id = "slots";
    let count = 0;

    for(var r = 0; r < rows; r++){
        let row = document.createElement("tr");

        for(var c = 0; c < cols; c++){
            var col = document.createElement("td");
            col.id = count;
            row.append(col);
            count++;
        }
        tabObj.append(row);   
    }
    tabObj.style.marginLeft = "auto";
    tabObj.style.marginRight = "auto";
    tables.append(tabObj);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

window.onload = function() {
    createTable(3,3);
}
