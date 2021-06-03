let spin = document.getElementById("spin");

spin.addEventListener("click", function(){
    let bet = document.getElementById("bet").value;

    fetch('/spin')
    .then(response => response.json())
    .then(async function(data){
        console.log(data);
        let size = Object.keys(data).length;
        if (document.getElementById("0").childElementCount > 0) {
            for (var x = 0; x < 9; x ++) {
                document.getElementById(x).removeChild(document.getElementById(x).firstChild);
            }
        }
        document.getElementById("0").append(findImg(data[0][0]));
        document.getElementById("1").append(findImg(data[0][1]));
        document.getElementById("2").append(findImg(data[0][2]));
        document.getElementById("3").append(findImg(data[1][0]));
        document.getElementById("4").append(findImg(data[1][1]));
        document.getElementById("5").append(findImg(data[1][2]));
        document.getElementById("6").append(findImg(data[2][0]));
        document.getElementById("7").append(findImg(data[2][1]));
        document.getElementById("8").append(findImg(data[2][2]));
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
                                        
                    document.getElementById("0").removeChild(document.getElementById("0").firstChild);
                    document.getElementById("1").removeChild(document.getElementById("1").firstChild);
                    document.getElementById("2").removeChild(document.getElementById("2").firstChild);
                    document.getElementById("3").removeChild(document.getElementById("3").firstChild);
                    document.getElementById("4").removeChild(document.getElementById("4").firstChild);
                    document.getElementById("5").removeChild(document.getElementById("5").firstChild);
                    document.getElementById("6").removeChild(document.getElementById("6").firstChild);
                    document.getElementById("7").removeChild(document.getElementById("7").firstChild);
                    document.getElementById("8").removeChild(document.getElementById("8").firstChild);

                    
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
                    document.getElementById("1").removeChild(document.getElementById("1").firstChild);
                    document.getElementById("2").removeChild(document.getElementById("2").firstChild);
                    document.getElementById("4").removeChild(document.getElementById("4").firstChild);
                    document.getElementById("5").removeChild(document.getElementById("5").firstChild);
                    document.getElementById("7").removeChild(document.getElementById("7").firstChild);
                    document.getElementById("8").removeChild(document.getElementById("8").firstChild);
                    
                    document.getElementById("1").append(findImg(data[top][x]));
                    document.getElementById("2").append(findImg(data[top][x+1]));
                    document.getElementById("4").append(findImg(data[mid][x]));
                    document.getElementById("5").append(findImg(data[mid][x+1]));
                    document.getElementById("7").append(findImg(data[bot][x]));
                    document.getElementById("8").append(findImg(data[bot][x+1]));
                }

                else {
                    document.getElementById("2").removeChild(document.getElementById("2").firstChild);
                    document.getElementById("5").removeChild(document.getElementById("5").firstChild);
                    document.getElementById("8").removeChild(document.getElementById("8").firstChild);
                    
                    document.getElementById("2").append(findImg(data[top][x]));
                    document.getElementById("5").append(findImg(data[mid][x]));
                    document.getElementById("8").append(findImg(data[bot][x]));
                }
                await sleep(50);
            }
        }
        console.log(bet);

        let responseArr = [
                            [document.getElementById("0").firstChild.value, document.getElementById("1").firstChild.value, document.getElementById("2").firstChild.value],
                            [document.getElementById("3").firstChild.value, document.getElementById("4").firstChild.value, document.getElementById("5").firstChild.value],
                            [document.getElementById("6").firstChild.value, document.getElementById("7").firstChild.value, document.getElementById("8").firstChild.value]
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
            let iWin = document.createElement("img");
            iWin.src = "symbols/win.png";
            console.log(data)
            document.getElementById("payout").innerText = data.payout;
            if(data.payout > 0) {
                let symbol = findImg(document.getElementById(data.lines[0]);
                for(var x = 0; x < 10; x++){
                    for(var i = 0; i < data.lines.length; i++){
                        document.getElementById(data.lines[i]).removeChild(document.getElementById(data.lines[i]).firstChild);
                        document.getElementById(data.lines[i]).append(iWin);
                        
                        await sleep(100);
                        
                        document.getElementById(data.lines[i]).removeChild(document.getElementById(data.lines[i]).firstChild);
                        document.getElementById(data.lines[i]).append(symbol);
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
    let number = parseInt(num);
    
    let iTen = document.createElement("img");
    iTen.src = "symbols/ten.png";
    iTen.value = "1";
    iTen.id = "ten";

    let iPlum = document.createElement("img");
    iPlum.src = "symbols/plum.png";
    iPlum.value = "2";
    iPlum.id = "plum";

    let iLemon = document.createElement("img");
    iLemon.src = "symbols/lemon.png";
    iLemon.value = "3";
    iLemon.id = "lemon";

    let iDiamond = document.createElement("img");
    iDiamond.src = "symbols/diamond.png";
    iDiamond.value = "4";
    iDiamond.id = "diamond";
    console.log("Number", number);
    console.log("Value", iTen.value);
    
    if (number === parseInt(iTen.value)) {
        return iTen;
    }
    
    if (number === parseInt(iPlum.value)) {
        return iPlum;
    }
    
    if (number === parseInt(iLemon.value)) {
        return iLemon;
    }
    
    if (number === parseInt(iDiamond.value)) {
        return iDiamond;
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
