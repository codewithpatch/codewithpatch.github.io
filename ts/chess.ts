var TURN = 'White';
var STANDBY = 'Black';

const blackPawnImage = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bp.png";
const blackRookImage = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/br.png";
const blackKnightImage = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bn.png";
const blackBishopImage = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bb.png";
const blackQueenImage = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bq.png";
const blackKingImage = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bk.png";

const whitePawnImage = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png";
const whiteRookImage = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wr.png";
const whiteKnightImage = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wn.png";
const whiteBishopImage = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wb.png";
const whiteKingImage = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wk.png";
const whiteQueenImage = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wq.png";

const chessPieceImages = {
    white: {
        king: whiteKingImage,
        queen: whiteQueenImage,
        rook: whiteRookImage,
        bishop: whiteBishopImage,
        knight: whiteKnightImage,
        pawn: whitePawnImage
    },
    black: {
        king: blackKingImage,
        queen: blackQueenImage,
        rook: blackRookImage,
        bishop: blackBishopImage,
        knight: blackKnightImage,
        pawn: blackPawnImage,
    }
}

var allowDrop = function ( e ) {
    e.preventDefault();
    ChessHint.deleteHints();
}

var drag = function ( e ) {
    e.dataTransfer.setData('chess-piece', e.target.id)
}

var drop = function ( e ) {
    // ChessHint.deleteHints();
    
    e.preventDefault();


    var pieceId = e.dataTransfer.getData('chess-piece');
    var pieceElement = document.getElementById(pieceId)
    var pieceColor = pieceElement.getAttribute('color')
    if (pieceColor != TURN) {
        console.log(`I'ts currently ${TURN}'s TURN!`)
        return
    }

    var targetElement = e.target;
    var chessPiece = ChessPiece.fromId(pieceId);
    
    var possibleMoves = chessPiece.calculatePossibleMoves()

    var targetBlock: HTMLElement;
    if (targetElement.className == 'chess-piece') {
        targetBlock = e.target.parentElement;
    } else {
        targetBlock = e.target;
    }
    
    if (!possibleMoves.hasOwnProperty(targetBlock.id)) {
        // Don't do the drop, if the move is an illegal move
        // All legal moves are stored in possibleMoves object

        console.log("Invalid move.");
        return
    }

    if (targetElement.className === 'chess-piece') {
        chessPiece.takes(targetElement)
        return
    }

    e.target.appendChild(pieceElement)

    // Change the color of the turn after move
    TURN = STANDBY;
    STANDBY = pieceColor;

    document.querySelector('h1').innerHTML = `It's ${TURN}'s turn.`
}

var clickPiece = function (e) {
    ChessHint.deleteHints()

    let element = e.target;
    let selectedAttribute = element.getAttribute('selected');

    if (selectedAttribute === 'true') {
        element.removeAttribute('selected')
        ChessHint.deleteHints()
        return
    }

    element.setAttribute('selected', 'true');
    let chessPiece = ChessPiece.fromHTMLElement(element);
    chessPiece.showPossibleMovesHint()
}

function play() {
    console.log("LETS PLAY!")
}

function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

class ChessNotation {
    constructor() {

    }
}

class ChessClock {
    time: string;
    constructor(time: string) {
        this.time = time;
    }
}

class ChessBoard {
    row: number;
    column: number;
    rowLabels: number[];
    columnLabels: string[];
    boardNotations: string[];
    boardBlocks: {};
    element: Element;
    boardPieces: ChessPiece[];


    constructor() {
        this.row = 8
        this.column = 8
        this.rowLabels = [1, 2, 3, 4, 5, 6, 7, 8]
        this.columnLabels = ["A", "B", "C", "D", "E", "F", "G", "H"]

        this.element = ChessBoard.selectBoardElement()

        this.boardPieces = this.generateBoardPieces();
        this.boardNotations = ChessBoard.generateBoardNotations();
        this.boardBlocks = ChessBoard.generateBoardBlocks()
    }

    static selectBoardElement(): Element {
        return document.getElementsByClassName('chess-board')[0];
    }


    static generateBoardNotations(): string[] {
        let rowLabels = [1, 2, 3, 4, 5, 6, 7, 8]
        let columnLabels = ["A", "B", "C", "D", "E", "F", "G", "H"]


        let coordinates = []
        for (const x of columnLabels) {
            for (const y of rowLabels) {
                coordinates.push(x + String(y))
            }
        }

        return coordinates
    }

    static generateBoardBlocks(): {} {
        let blocks = {}
        for (let notation of ChessBoard.generateBoardNotations()) {
            let block = ChessBlock.fromNotation(notation);
            blocks[block.notation] = block;
        }

        return blocks;
    }

    static clearBoardHints(): void {
        ChessHint.deleteHints()
    }

    createBoard(): void {
        for (let notation of this.boardNotations) {
            let block = this.boardBlocks[notation]
            this.element.appendChild(block.element)
        }
    }

    generateBoardPieces(): ChessPiece[] {
        var chessPieces = [];

        let whiteKing = new King("White", whiteKingImage);
        let whiteQueen = new Queen("White", whiteQueenImage);
        let blackKing = new King("Black", blackKingImage);
        let blackQueen = new Queen("Black", blackQueenImage);

        chessPieces.push(whiteKing); chessPieces.push(whiteQueen);
        chessPieces.push(blackKing); chessPieces.push(blackQueen);

        for (let i = 1; i <= 8; i++) {
            let pieceNumber = i;

            let whitePawn = new Pawn(pieceNumber, 'White', whitePawnImage);
            let blackPawn = new Pawn(pieceNumber, "Black", blackPawnImage);
            
            if (pieceNumber <= 2) {
                let whiteRook = new Rook(pieceNumber, "White", whiteRookImage);
                let whiteKnight = new Knight(pieceNumber, "White", whiteKnightImage);
                let whiteBishop = new Bishop(pieceNumber, "White", whiteBishopImage);
                let blackRook = new Rook(pieceNumber, "Black", blackRookImage);
                let blackKnight = new Knight(pieceNumber, "Black", blackKnightImage);
                let blackBishop = new Bishop(pieceNumber, "Black", blackBishopImage);

                chessPieces.push(whiteRook);
                chessPieces.push(whiteKnight);
                chessPieces.push(whiteBishop);
                chessPieces.push(blackRook);
                chessPieces.push(blackKnight);
                chessPieces.push(blackBishop);
            }
            
            chessPieces.push(blackPawn);
            chessPieces.push(whitePawn);
        }

        return chessPieces;
    }

    resetBoard(): void {
        this.clearBoard()
        this.startGame()
        // let resetPromise = new Promise(() => {
        //     this.clearBoard()
        // })
        // resetPromise.then(
        //     this.startGame()
        // )
    }

    clearBoard(): void {
        // for (let piece of this.boardPieces) {
        //     let pieceElement = piece.currentElement
        //     pieceElement.remove();
        // }
        var chessPieces = document.querySelectorAll('.chess-piece')
        chessPieces.forEach(piece => piece.remove())
    }

    startGame(): void {
        for (let piece of this.boardPieces) {
            let parent = document.getElementById(piece.position.notation)
            let pieceElement = piece.createElement();

            parent.appendChild(pieceElement);
        }
    }

    placePiece() {}
    removePiece() {}

    static play() {
        console.log("LETS PLAY!")
        // board.startGame()
    }
}

class ChessHint {
    class: string;
    backgroundColor: string;
    element: HTMLDivElement;
    size: string;

    constructor() {
        this.class = 'hint';
        this.size = '25%';
        this.element = this.createElement();
        // this.backgroundColor = 'rgba(0, 0, 0, 0.1';
        
    }

    createElement(): HTMLDivElement {
        let hint = document.createElement('div');
        hint.className = this.class;
        hint.style.backgroundColor = 'rgba(0, 0, 0, 0.1';
        hint.style.backgroundClip = 'content-box';
        hint.style.borderRadius = '50%';
        hint.style.width = this.size;
        hint.style.height = this.size;

        return hint;
    }

    static deleteHints() {
        let hintElements = document.getElementsByClassName('hint')
        let hintCount = hintElements.length
        for (let i = 0; i < hintCount; i++) {
            hintElements[0].remove()
        }
    }
}

class ChessPosition {
    row: number;
    column: string;

    constructor(column: string, row: number) {
        this.column = column;
        this.row = row;
    }

    get notation() {
        return this.column + String(this.row)
    }

    set notation(notation: string) {
        this.column = notation[0]
        this.row = Number(notation[1])
    }

    get coordinates(): number[] {
        let x = this.column.toUpperCase().charCodeAt(0) - 65;
        let y = this.row - 1;
        
        return [x, y]
    }

    set coordinates(cooratinates: number[]) {
        this.column = String.fromCharCode(cooratinates[0] + 65)
        this.row = cooratinates[1]
    }

    static startingPositions(): {} {
        return {
            "Pawn": {
                'White': ["A2", "B2", "C2", "D2", "E2", "F2", "G2", "H2"],
                'Black': ["A7", "B7", "C7", "D7", "E7", "F7", "G7", "H7"]
            },
            "Rook": {
                'White': ["A1", "H1"],
                'Black': ["A8", "H8"]
            },
            "Bishop": {
                'White': ["C1", "F1"],
                'Black': ["C8", "F8"]
            },
            "Knight": {
                'White': ["B1", "G1"],
                'Black': ["B8", "G8"]
            },
            "King": {
                'White': ["E1"],
                'Black': ["E8"]
            },
            "Queen": {
                'White': ["D1"],
                'Black': ["D8"]
            }
        }
    }

    static fromNotation(notation: string): ChessPosition {
        let column = notation[0];
        let row = Number(notation[1]);

        return new ChessPosition(column, row);
    }

    static fromCoordinates(coordinates: number[]): ChessPosition {
        let column = String.fromCharCode(coordinates[0] + 65)
        let row = coordinates[1]

        return new ChessPosition(column, row);
    }

    static start(chessPiece: ChessPiece): ChessPosition {
        let name = chessPiece.name
        let color = chessPiece.color
        let index = chessPiece.pieceNumber - 1
        let startingPositions = ChessPosition.startingPositions()
        let positionCoordinates = startingPositions[name][color][index]
        
        return ChessPosition.fromNotation(positionCoordinates)
    }

    static coordinatesToNotation(coordinates: number[]): string {
        let column = String.fromCharCode(coordinates[0] + 65)
        let row = String(coordinates[1] + 1)

        return column + row
    }

    static notationToCoordinates(notation: string): number[] {
        let x = notation[0].charCodeAt(0) - 65;
        let y = Number(notation[1]);

        return [x, y]
    }

    static fromHTMLPieceElement(element: HTMLElement) {
        let parentNotation = element.parentElement.id

        return ChessPosition.fromNotation(parentNotation)
    }
}

class ChessBlock extends ChessPosition {
    blackHex: string;
    whiteHex: string;
    color: string;
    element: HTMLDivElement;

    constructor(column: string, row: number) {
        super(column, row)

        this.blackHex = '#779556';
        this.whiteHex = '#ebecd0';
        this.color = this.generateColor()
        this.element = this.generateElement()
    }

    generateColor(): string {
        let positionValue = this.coordinates.reduce((a, b) => a + b)

        if (positionValue % 2 === 0) {
            return this.blackHex
        }

        return this.whiteHex
    }

    generateElement(): HTMLDivElement {
        // let hint = new ChessHint;
        let block = document.createElement('div')
        block.className = 'block';
        block.id = this.notation;
        block.style.minWidth = "100%";
        block.style.minHeight = "100%";
        block.style.maxWidth = 'fit-content';
        block.style.maxHeight = 'fit-content';
        block.style.gridArea = this.notation
        block.style.backgroundColor = this.color;
        block.style.display = 'grid';
        block.style.placeItems = 'center';

        block.setAttribute('ondrop', 'drop(event)');
        block.setAttribute('ondragover', 'allowDrop(event)');
        // block.appendChild(hint.element);

        return block;
    }

    static fromNotation(notation: string) : ChessBlock {
        let column = notation[0];
        let row = Number(notation[1]);

        return new ChessBlock(column, row);
    }

    selectElement(): Element {
        let board = ChessBoard.selectBoardElement()
        let block = board.querySelector(`#${this.notation}`)

        return block;
    }

    dropOn() {
        let block = this.selectElement()
        let hint = new ChessHint;

        block.setAttribute('ondrop', "drop(event)");
        block.setAttribute('ondragover', 'allowDrop(event)');
        block.appendChild(hint.element);
    }
}

class ChessPiece {
    active: boolean;
    name: string;
    pieceNumber: number;
    color: string;
    moveDescription: string;
    position: ChessPosition;
    image: string;
    class: string;


    constructor(name: string, pieceNumber: number, color: string, image: string, moveDescription: string) {
        
        this.name = toTitleCase(name);
        this.color = toTitleCase(color);
        this.pieceNumber = pieceNumber;
        this.moveDescription = moveDescription;
        this.image = image;

        this.active = true;
        this.position = ChessPosition.start(this);
        this.class = "chess-piece";
        // this.block_elements =

        if (!this.active) {
            this.position = null;
        }
    }

    get status(): string {
        if (this.name === 'Pawn') {
            if (this.color === 'White' && this.currentPosition.row === 2) {
                return 'startingPosition'
            }

            else if (this.color === 'Black' && this.currentPosition.row === 7) {
                return 'startingPosition'
            }
        }

        return 'normal'
    }

    get id(): string {
        return `${this.name.toLowerCase()}-${this.color.toLowerCase()}-${String(this.pieceNumber).toLowerCase()}`
    }

    get currentElement(): Element {
        return document.querySelector(`#${this.id}`);
    }

    get currentPosition(): ChessPosition {
        let pieceElement = document.getElementById(this.id)
        return ChessPosition.fromHTMLPieceElement(pieceElement)
    }

    takes(targetElement: HTMLElement): void {
        // if (targetElement.hasChildNodes()) {
        //     targetElement.children[0].remove()
        // }
        if (targetElement.getAttribute('color') === this.color) {
            console.log("Invalid move!")
            return
        }
        
        targetElement.parentElement.appendChild(this.currentElement);
        targetElement.remove()

        // Change the color of the turn after move
        TURN = STANDBY;
        STANDBY = this.color;

        document.querySelector('h1').innerHTML = `It's ${TURN}'s turn.`
    }

    
    selectElement(): HTMLDivElement {
        return document.querySelector(`${this.id}`);
    }

    clickElement(): void {
        let element = this.selectElement();
        let selectedAttribute = element.getAttribute('selected');

        if (selectedAttribute === 'true') {
            element.removeAttribute('selected')
            return
        }

        element.setAttribute('selected', 'true');
    }

    resetPosition(): void {
        this.position = ChessPosition.start(this);
    }

    createElement(): HTMLImageElement {
        let piece = document.createElement('img');
        piece.id = this.id;
        piece.className = this.class;
        piece.onclick = clickPiece;
        piece.src = this.image;
        piece.alt = `${this.name} chess piece image`;
        piece.style.maxWidth = '100%';
        piece.style.maxHeight = '100%';

        piece.setAttribute('color', this.color);
        piece.setAttribute('draggable', 'true');
        piece.setAttribute('ondragstart', 'drag(event)');

        return piece;
    }

    calculatePossibleMoves(): {} {
        let position: ChessPosition = this.currentPosition;
        let movementCoordinates: {} = ChessPiece.movesMap()[this.name.toLocaleLowerCase()][this.status]

        let possibleMoves = {}
        Object.keys(movementCoordinates).forEach(direction => {
            if (this.name === 'Pawn' && this.color.toLowerCase() != direction) {
                // For pawns, the direction is actually colors
                // We want to just process movement for its color
                // We will skip if the piece color is not equal to the iterations color
                return
            }

            for (let moveArray of movementCoordinates[direction]) {
                let newX = position.coordinates[0] + moveArray[0]
                let newY = position.coordinates[1] + moveArray[1]

                if (newX < 0 || newY < 0 || newX > 7 || newY > 7) {
                    // the origin of the board is at notation A1
                    // if the result of x and y becomes negative, its already outside of the board
                    // Maximum x and y point is 7. Anything that goes beyond are outside the board.
                    continue;
                }

                let newCoordinates = [newX, newY]
                let newId = ChessPosition.coordinatesToNotation(newCoordinates)
                let element = document.querySelector(`#${newId}`)

                if (!element.hasChildNodes()) {
                    if (this.name === 'Pawn' && moveArray[0] != 0) {
                        // Pawns can only move sideways if it will take
                        continue;
                    }

                    // If the block does not have child element, then its a legal move
                    possibleMoves[newId] = newCoordinates;
                    continue;
                } else {
                    // WE HIT AN OBSTACLE

                    // Check if the color of the element is different color
                    // If yes, then the block is a legal square to move in
                    let pieceElement = element.firstElementChild;
                    let color = pieceElement.getAttribute('color')
                    if (this.color.toLowerCase() === color.toLowerCase()) {
                        // If it's the same color, it's an illegal move.
                        return; 
                    }

                    // If it's a pawn, the only legal move with obstacle is diagonally
                    if (this.name === 'Pawn' && moveArray[0] === 0) {
                        continue;
                    }

                    possibleMoves[newId] = newCoordinates;
                    return;
                }

                // Normally, the chesspiece can't go through the path, if there is an obstacle
                // return statement 
                //      will stop the calculation of the next moveArray
                //      Since the piece can't go through the path
            }
        })

        return possibleMoves;
    }

    showPossibleMovesHint(): void {
        if (this.color != TURN) {
            console.log(`I'ts currently ${TURN}'s TURN!`)
            return
        }

        let selectedPiece = this.currentElement;
        let selectedAttr = selectedPiece.getAttribute('selected')
        // selectedPiece.setAttribute("selected", "true");
        
        let possibleMovesObj = this.calculatePossibleMoves()
        let possibleMovesIds = Object.keys(possibleMovesObj);

        possibleMovesIds.forEach(id => {
            let chessHintElement = new ChessHint;
            let blockElement = document.querySelector("#" + id);
            blockElement.appendChild(chessHintElement.element)
        })
    }

    static fromHTMLElement(element: HTMLElement): ChessPiece {
        let name = element.id.split("-")[0]
        let color = element.id.split("-")[1]
        let pieceNumber = Number(element.id.split("-")[2])
        let imageLink = chessPieceImages[color][name];
        let moveDescription = ""

        return new ChessPiece(name, pieceNumber, color, imageLink, moveDescription);
    }

    static fromId(id: string): ChessPiece {
        let element = document.getElementById(id);

        return ChessPiece.fromHTMLElement(element);
    }

    static movesMap() {
        let blockArr = [0, 1, 2, 3, 4, 5, 6];

        return {
            king: {
                normal: {
                    right: [[1, 0]],
                    up: [[0, 1]],
                    left: [[-1, 0]],
                    down: [[0, -1]],
                    q1: [[1, 1]],
                    q2: [[-1, 1]],
                    q3: [[-1, -1]],
                    q4: [[1, -1]]
                }
            },

            queen: {
                normal: {
                    q1: (() => blockArr.map(i => [1 + i, 1 + i]))(),
                    q2: (() => blockArr.map(i => [-1 - i, 1 + i]))(),
                    q3: (() => blockArr.map(i => [-1 - i, -1-i]))(),
                    q4: (() => blockArr.map(i => [1 + i, -1-i]))(),
                    up: (() => blockArr.map(i => [0, 1 + i]))(),
                    down: (() => blockArr.map(i => [0, -1-i]))(),
                    left: (() => blockArr.map(i => [-1-i, 0]))(),
                    right: (() => blockArr.map(i => [1 + i, 0]))(),
                }
            },

            bishop: {
                normal: {
                    q1: (() => blockArr.map(i => [1 + i, 1 + i]))(),
                    q2: (() => blockArr.map(i => [-1 - i, 1 + i]))(),
                    q3: (() => blockArr.map(i => [-1 - i, -1 - i]))(),
                    q4: (() => blockArr.map(i => [1 + i, -1 - i]))(),
                }
            },

            knight: {
                normal: {
                    q1: [
                        [1, 2],
                        [2, 1],
                    ],
                    q2: [
                        [-1, 2],
                        [-2, 1]
                    ],
                    q3: [
                        [-1, -2],
                        [-2, -1]
                    ],
                    q4: [
                        [1, -2],
                        [2, -1]
                    ]
                }
            },

            rook: {
                normal: {
                    up: (() => blockArr.map(i => [0, 1 + i]))(),
                    down: (() => blockArr.map(i => [0, 1 - i]))(),
                    left: (() => blockArr.map(i => [1 - i, 0]))(),
                    right: (() => blockArr.map(i => [1 + i, 0]))(),
                }
            },

            pawn: {
                startingPosition: {
                    white: [
                        [0, 1],
                        [0, 2],
                        [1, 1],
                        [-1, 1]

                    ],
                    black: [
                        [0, -1],
                        [0, -2],
                        [1, -1],
                        [-1, -1]
                    ]
                },
                normal: {
                    white: [
                        [0, 1],
                        [1, 1],
                        [-1, 1]
                    ],
                    black: [
                        [0, -1],
                        [1, -1],
                        [-1, -1]
                    ]
                },
                enPassant: {
                    white: [[1, 1], [-1, 1]],
                    black: [[-1, -1], [1, -1]]
                }
            }
        }
    }

}

class King extends ChessPiece {
    constructor(color: string, image: string) {
        super("King", 1, color, image, "Block");
    }
}

class Queen extends ChessPiece {
    constructor(color: string, image: string) {
        super("Queen", 1, color, image, "Diagonal-Horizontal-Vertical");
    }
}

class Bishop extends ChessPiece {
    constructor(pieceNumber: number, color: string, image: string) {
        super("Bishop", pieceNumber,color, image, "Diagonal");
    }
}

class Knight extends ChessPiece {
    constructor(pieceNumber: number, color: string, image: string) {
        super("Knight", pieceNumber, color, image, "L-Jump");
    }
}

class Rook extends ChessPiece {
    constructor(pieceNumber: number, color: string, image: string) {
        super("Rook", pieceNumber, color, image, "Horizontal-Vertical");
    }
}

class Pawn extends ChessPiece {
    constructor(pieceNumber: number, color: string, image: string) {
        super("Pawn", pieceNumber, color, image, "1-2-Forward");
    }
    enPassant() {

    }

    promote() {

    }
}

// main
var board = new ChessBoard;
board.createBoard();
// board.startGame();

