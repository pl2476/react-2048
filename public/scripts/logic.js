//移动端
documentWidth = window.screen.availWidth;
gridContainerWidth = 0.92 * documentWidth;
cellSideLength = 0.18 * documentWidth;
cellSpace = 0.04 * documentWidth;
gridContainerWidth = 440;
cellSpace = 5;
cellSideLength = 100;
var preGD;



//在特定位置生成数字和其必要属性
function getRandom() {
    //可设置概率模式
    // var set = [2, 2, 2, 2, 4, 4];
    // var num = set[Math.floor(Math.random() * set.length)];

    // 50%概率模式
    var randomNum = Math.random() < 0.5 ? 2 : 4
    return {
        value: randomNum,
        isNew: true,
        isMerged: false,
        row: -1,
        oldRow: -1,
        column: -1,
        oldColumn: -1,
    };
}

function getPosTop(i, j) {
    return cellSpace + i * (cellSpace * 2 + cellSideLength);
}

function getPosLeft(i, j) {
    return cellSpace + j * (cellSpace * 2 + cellSideLength);;
}

function clearnumSetStatus(gd) {
    gd.numSet.forEach(function(row, keyRow) {
        row.forEach(function(elem, keyCol) {
            gd.numSet[keyRow][keyCol].isNew = false;
            gd.numSet[keyRow][keyCol].isMerged = false;
        });
    });
    return gd;
}

function slideTo(direction, gd) {
    preGd = gd;
    switch (direction) {
        case 'up':
            gd = clearnumSetStatus(gd);
            gd = slideToTop(gd);
            break;
        case 'down':
            gd = clearnumSetStatus(gd);
            gd = slideToBottom(gd);
            break;
        case 'left':
            gd = clearnumSetStatus(gd);
            gd = slideToLeft(gd);
            break;
        case 'right':
            gd = clearnumSetStatus(gd);
            gd = slideToRight(gd);
            break;
    }
    gd = addNewNum(gd, 2048);
    return gd;
}

function slideToTop(gd) {
    gd.scoreBoard.scoreAddition = 0;
    var tl = gd.numSet.length;
    var changed = false;
    var notfull = false;
    for (var i = 0; i < tl; i++) {

        var np = tl;
        var n = 0; // 统计每一列中非零值的个数

        // 向上移动非零值，如果有零值元素，则用非零元素进行覆盖
        for (var x = 0; x < np; x++) {
            if (gd.numSet[x][i].value != 0) {
                gd.numSet[n][i].value = gd.numSet[x][i].value;
                gd.numSet[n][i].oldRow = x;
                gd.numSet[n][i].oldColumn = i;

                if (n != x) {
                    changed = true; // 标示数组的元素是否有变化
                }
                n++;
            }
        }
        if (n < tl) {
            notfull = true;
        }
        np = n;
        // 向上合并所有相同的元素
        for (var u = 0; u < np - 1; u++) {
            if (gd.numSet[u][i].value == gd.numSet[u + 1][i].value) {
                gd.numSet[u][i].value *= 2;
                gd.numSet[u][i].isMerged = true;
                gd.numSet[u + 1][i] = {
                    value: 0,
                    isNew: false,
                    isMerged: false,
                };
                gd.scoreBoard.scoreAddition += gd.numSet[u][i].value;
                // gd.scoreBoard.score += gd.scoreBoard.scoreAddition; // 计算游戏分数
                // if (gd.scoreBoard.score > gd.scoreBoard.bestScore) {
                //     gd.scoreBoard.bestScore = gd.scoreBoard.score;
                //     window.localStorage.setItem('bestScore', gd.scoreBoard.bestScore);
                // }
                u++;
                changed = true;
            }
        }
        // 合并完相同元素以后，再次向上移动非零元素
        n = 0;
        for (var t = 0; t < np; t++) {
            if (gd.numSet[t][i].value != 0) {
                gd.numSet[n][i] = gd.numSet[t][i];
                n++;
            }
        }
        // 对于没有检查的元素
        for (var o = n; o < tl; o++) {
            gd.numSet[o][i] = {
                value: 0,
                isNew: false,
                isMerged: false
            };
        }
    }
    return gd;
}

function setPosition(gd) {
    gd.forEach(function(row, rowIndex) {
        row.forEach(function(tile, columnIndex) {
            tile.oldRow = tile.row;
            tile.oldColumn = tile.column;
            tile.row = rowIndex;
            tile.column = columnIndex;
        });
    });
}

function slideToBottom(gd) {
    gd = MirrorV(gd);
    gd = slideToTop(gd);
    gd = MirrorV(gd);
    return gd;
}

function slideToLeft(gd) {
    gd = Right90(gd);
    gd = slideToTop(gd);
    gd = Left90(gd);
    return gd;
}

function slideToRight(gd) {
    gd = Left90(gd);
    gd = slideToTop(gd);
    gd = Right90(gd);
    return gd;
}

function Right90(gd) {
    var MapLen = gd.numSet.length;
    var newGd = init(MapLen);
    gd.numSet.forEach(function(row, x) {
        row.forEach(function(elem, y) {
            newGd[y][MapLen - x - 1] = elem;
        });
    })
    gd.numSet = newGd;
    return gd;
}

function Left90(gd) {
    var MapLen = gd.numSet.length;
    var newGd = init(MapLen);
    gd.numSet.forEach(function(row, x) {
        row.forEach(function(elem, y) {
            newGd[MapLen - y - 1][x] = elem;
        });
    })
    gd.numSet = newGd;
    return gd;
}

function MirrorV(gd) {
    var MapLen = gd.numSet.length;
    var newGd = init(MapLen);
    gd.numSet.forEach(function(row, x) {
        row.forEach(function(elem, y) {
            newGd[MapLen - x - 1][y] = elem;
        });
    })
    gd.numSet = newGd;
    return gd;
}



function startGame() {
    var score = 0;
    // var bestScore = window.localStorage.getItem('bestScore');
    // bestScore = bestScore ? bestScore : 0;
    var status = 'runing';
    var MapLen = 4;
    var MaxScore = 2048;
    var gameData = init(MapLen);
    var gd = {
        numSet: gameData,
        scoreBoard: {
            score: score,
            // bestScore: bestScore,
            scoreAddition: 0
        },
        status: status
    };
    for (i = 0; i < 2; i++) {
        gd = addNewNum(gd, MaxScore);
    }
    return gd;
}



function init(n) {
    var gameMap = [];
    for (var i = 0; i < n; i++) {
        var tmp = [];
        for (var j = 0; j < n; j++) {
            tmp.push({
                value: 0,
                isNew: false,
                isMerged: false,
                row: -1,
                oldRow: -1,
                column: -1,
                oldColumn: -1,
            });
        }
        gameMap.push(tmp);
    }
    return gameMap;
}

//


var Game = function() {
    this.score = 0;
    this.status = 'runing';
    this.MaxScore = 2048;
    this.gd = this.initNum(Game.size);
    for (i = 0; i < 2; i++) {
        this.checkGameStatusAndAddNum();
    }
}

Game.size = 4;

Game.prototype.checkGameStatusAndAddNum = function() {
    var state;
    var pool = [];
    this.gd.forEach(function(row, keyRow) {
        row.forEach(function(elem, keyCol) {
            if (elem.value >= this.MaxScore) {
                state = true;
            } else if (elem.value === 0) {
                pool.push({
                    x: keyRow,
                    y: keyCol
                });
            }
        });
    });
    //console.log(gd.numSet);
    // if (state === true) {
    //     gd.status = 'win';
    //     return gd;
    // }
    // if (pool.length === 0) {
    //     gd.status = 'lose';
    //     return gd;
    // }

    //生成空余地方的数组，在其中随即一个位置生成一个新数字;
    var pos = pool[Math.floor(Math.random() * pool.length)];
    var numValue = getRandomValue();
    this.gd[pos.x][pos.y] = this.addTile(numValue, pos.x, pos.y)
}


//在特定位置生成数字和其必要属性
function getRandomValue() {
    //可设置概率模式
    // var set = [2, 2, 2, 2, 4, 4];
    // var num = set[Math.floor(Math.random() * set.length)];

    // 50%概率模式
    var randomNumValue = Math.random() < 0.5 ? 2 : 4
    return randomNumValue;
}
Game.prototype.initNum = function(n) {
    var gameMap = [];
    for (var i = 0; i < n; i++) {
        var tmp = [];
        for (var j = 0; j < n; j++) {
            tmp.push({
                value: 0,
                isNew: false,
                isMerged: false,
                row: -1,
                column: -1,
                oldRow: -1,
                oldColumn: -1,
            });
        }
        gameMap.push(tmp);
    }
    return gameMap;
}

Game.prototype.move = function(direction) {
    // 0 -> left, 1 -> up, 2 -> right, 3 -> down
    this.clearOldTiles();
    for (var i = 0; i < direction; ++i) {
        this.gd = rotateLeft(this.gd);
    }
    var hasChanged = this.moveLeft();
    for (var i = direction; i < 4; ++i) {
        this.gd = rotateLeft(this.gd);
    }
    if (hasChanged) {
        this.checkGameStatusAndAddNum();
    }
    this.setPositions();
    return this;
};

Game.prototype.clearOldTiles = function() {
    this.gd.forEach(function(row, keyRow) {
        row.forEach(function(elem, keyCol) {
            this.isNew = false;
            this.isMerged = false;
        });
    });
};

var rotateLeft = function(matrix) {
    var rows = matrix.length;
    var columns = matrix[0].length;
    var res = [];
    for (var row = 0; row < rows; ++row) {
        res.push([]);
        for (var column = 0; column < columns; ++column) {
            res[row][column] = matrix[column][columns - row - 1];
        }
    }
    return res;
};
Game.prototype.moveLeft = function() {
    var hasChanged = false;
    for (var row = 0; row < Game.size; ++row) {
        var currentRow = this.gd[row].filter(function(tile) {
            return tile.value != 0;
        });
        var resultRow = [];
        for (var target = 0; target < Game.size; ++target) {
            var targetTile = currentRow.length ? currentRow.shift() : this.addTile();
            if (currentRow.length > 0 && currentRow[0].value == targetTile.value) {
                var tile1 = targetTile;
                targetTile = this.addTile(targetTile.value);
                tile1.mergedInto = targetTile;
                var tile2 = currentRow.shift();
                tile2.mergedInto = targetTile;
                targetTile.value += tile2.value;
            }
            resultRow[target] = targetTile;
            this.won |= (targetTile.value == 2048);
            hasChanged |= (targetTile.value != this.gd[row][target].value);
        }
        this.gd[row] = resultRow;
    }
    return hasChanged;
};


var Tile = function(value, row, column) {
    console.log(value, row, column)
    this.value = value || 0;
    this.row = row || -1;
    this.column = column || -1;
    this.oldRow = -1;
    this.oldColumn = -1;
    this.isMerged = false;
    this.isNew = false;
};

Game.prototype.addTile = function() {
    var res = new Tile;
    Tile.apply(res, arguments);
    return res;
};



Game.prototype.setPositions = function(gd) {
    this.gd.forEach(function(row, rowIndex) {
        row.forEach(function(tile, columnIndex) {

            tile.oldRow = tile.row;
            tile.oldColumn = tile.column;
            tile.row = rowIndex;
            tile.column = columnIndex;
        });
    });
}