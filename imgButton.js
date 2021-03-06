class ImgButton extends Button {
	constructor(init, img, onClick, screenIndex) {
		super(init, onClick, screenIndex);
		this.img = img;
	}

	render() {
		if (!super.checkScreen()) return;
		image(this.img, this.pos.x, this.pos.y, this.size.x, this.size.y);
	}
}
