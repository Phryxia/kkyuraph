class Parser {
	constructor() {

	}

	parse(str, vari) {
		// initialize
		this.s = str;
		this.c = null;
		this.i = 0;
		this.getchar();
		this.lex();
		this.vari = vari;

		// parse
		return this.parseE();
	}

	getchar() {
		if (this.i < this.s.length)
			this.c = this.s[this.i++];
		else
			this.c = -1;
	}

	lex() {
		// remove whitespace
		while (this.c === ' ' || this.c === '\n' || this.c === '\t')
			this.getchar();

		// parse lexeme
		this.token = '';
		if (this.isNumber(this.c)) {
			// parse number
			while (this.isNumber(this.c)) {
				this.token += this.c;
				this.getchar();
			}

			// float number
			if (this.c === '.') {
				this.token += this.c;
				this.getchar();
				while (this.isNumber(this.c)) {
					this.token += this.c;
					this.getchar();
				}
			}
			this.tid = Parser.NUMBER;
		}
		else if (this.isAlphabet(this.c) || this.c === '_') {
			// parse identifier
			while (this.isAlphabet(this.c) || this.isNumber(this.c) || this.c === '_') {
				this.token += this.c;
				this.getchar();
			}
			this.tid = Parser.IDENTIFIER;
		}
		else if (this.c === '+') {
			this.token += this.c;
			this.getchar();
			this.tid = Parser.OP_ADD;
		}
		else if (this.c === '-') {
			this.token += this.c;
			this.getchar();
			this.tid = Parser.OP_SUB;
		}
		else if (this.c === '*') {
			this.token += this.c;
			this.getchar();
			this.tid = Parser.OP_MUL;
		}
		else if (this.c === '/') {
			this.token += this.c;
			this.getchar();
			this.tid = Parser.OP_DIV;
		}
		else if (this.c === '^') {
			this.token += this.c;
			this.getchar();
			this.tid = Parser.OP_EXP;
		}
		else if (this.c === '(') {
			this.token += this.c;
			this.getchar();
			this.tid = Parser.PAREN_L;
		}
		else if (this.c === ')') {
			this.token += this.c;
			this.getchar();
			this.tid = Parser.PAREN_R;
		}
		else if (this.c === ',') {
			this.token += this.c;
			this.getchar();
			this.tid = Parser.COMMA;
		}
		else {
			this.token += this.c;
			this.tid = -1;
		}
	}

	/*
		E ::= T | E + T | E - T
	*/
	parseE() {
		let value = this.parseT();
		while (this.tid === Parser.OP_ADD || this.tid === Parser.OP_SUB) {
			if (this.tid === Parser.OP_ADD) {
				this.lex();
				value += this.parseT();
			}
			else {
				this.lex();
				value -= this.parseT();
			}
		}
		return value;
	}

	/*
		T ::= F | T * F | T / F
	*/
	parseT() {
		let value = this.parseF();
		while (this.tid === Parser.OP_MUL || this.tid === Parser.OP_DIV) {
			if (this.tid === Parser.OP_MUL) {
				this.lex();
				value *= this.parseF();
			}
			else {
				this.lex();
				value /= this.parseF();
			}
		}
		return value;
	}

	/*
		F ::= U | F ^ U
	*/
	parseF() {
		let value = this.parseU();
		while (this.tid === Parser.OP_EXP) {
			this.lex();
			value = Math.pow(value, this.parseU());
		}
		return value;
	}

	/*
		U ::= + V | - V | V
	*/
	parseU() {
		if (this.tid === Parser.OP_ADD) {
			this.lex();
			return this.parseV();
		}
		else if (this.tid === Parser.OP_SUB) {
			this.lex();
			return -this.parseV();
		}
		else {
			return this.parseV();
		}
	}

	/*
		V ::= id(EL)
			| id
			| (E)
			| number
		EL::= ε | EL, E
	*/
	parseV() {
		if (this.tid === Parser.IDENTIFIER) {
			let vname = this.token;
			this.lex();

			if (this.tid === Parser.PAREN_L) {
				// function인 경우
				this.lex();

				let args = [];
				if (this.tid === Parser.PAREN_R) {
					this.lex();
					// 0인자 함수
					if (Math[vname])
						return Math[vname]();
					else
						return Parser[vname]();
				}
				else {
					while (true) {
						args.push(this.parseE());
						
						// 인자가 더 있는 경우
						if (this.tid === Parser.COMMA)
							this.lex();
						else
							break;
					}
					if (this.tid === Parser.PAREN_R) {
						this.lex();

						// Math에 있는 함수인지 찾아본다.
						if (Math[vname])
							return Math[vname].apply(null, args);
						else
							return Parser[vname].apply(null, args);
					}
					else {
						throw Error(`Unexpected token ${this.token}, missing )`)
					}
				}
			}
			else {
				// variable인 경우
				// Math에 있는 상수인지 체크해보고 없으면 vari를 확인한다.
				if (Math[vname] !== undefined)
					return Math[vname];
				else
					return this.vari[vname];
			}
		}
		else if (this.tid === Parser.PAREN_L) {
			this.lex();
			let value = this.parseE();
			if (this.tid === Parser.PAREN_R) {
				this.lex();
				return value;
			}
			else {
				throw Error(`Unexpected token ${this.token}, missing )`)
			}
		}
		else if (this.tid === Parser.NUMBER) {
			let value = Number.parseFloat(this.token);
			this.lex();
			return value;
		}
		else {
			throw Error(`Unexpected token ${this.token}`);
		}
	}

	isNumber(c) {
		return '0' <= c && c <= '9';
	}

	isAlphabet(c) {
		return ('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z');
	}
}

Parser.NUMBER = 1;
Parser.OP_ADD = 2;
Parser.OP_SUB = 3;
Parser.OP_MUL = 4;
Parser.OP_DIV = 5;
Parser.OP_EXP = 6;
Parser.PAREN_L = 7;
Parser.PAREN_R = 8;
Parser.IDENTIFIER = 9;
Parser.COMMA = 10;

Parser.relu = (x) => (x > 0 ? x : 0);

export default Parser;