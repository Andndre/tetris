class ImgButton extends Button {
	constructor(pos, img, size, onClick, screenIndex) {
		super(pos, size, onClick, screenIndex);
		this.img = img;
	}

	render() {
		if (!super.checkScreen()) return;
		image(this.img, this.pos.x, this.pos.y, this.size.x, this.size.y);
	}
}
