class Button {
	constructor(init, onClick, screenIndex) {
		this.init = () => {
			[this.pos, this.size] = init();
		};
		this.init();
		this.screenIndex = screenIndex;
		this.onClick = onClick;
	}

	refresh() {
		this.init();
	}

	click() {
		if (!this.check()) return false;
		this.onClick();
		return true;
	}

	render() {}

	checkCoord() {
		return (
			mouseX >= this.pos.x &&
			mouseX <= this.pos.x + this.size.x &&
			mouseY >= this.pos.y &&
			mouseY <= this.pos.y + this.size.y
		);
	}

	checkScreen() {
		return (
			this.screenIndex == tetrisScreen.currentScreen ||
			this.screenIndex == STATE_GLOBAL
		);
	}

	check() {
		return this.checkScreen() && this.checkCoord();
	}
}
