/**
 * @extends {Sprite}
 * @constructor
 */
function FMovieClip(textures)
{
    PIXI.Sprite.call(this, textures[0]);
    //args
    this.textures = textures;
    //public
    this.motionSpeed = 1;
    this.loop        = true;
    this.stopFrame   = null;
    this.complete    = null;
    //private
    this.playing = false;
    this.time    = 0;
}

FMovieClip.prototype = Object.create(PIXI.Sprite.prototype);
FMovieClip.prototype.constructor = FMovieClip;

Object.defineProperties(FMovieClip.prototype, {
    currentFrame: {
        get: function() {
            return (this.time | 0) % this.textures.length;
        }
    }
});

FMovieClip.prototype.play = function()
{
    this.playing = true;
};

FMovieClip.prototype.gotoAndPlay = function(frame)
{
    this.time = frame;
    this.playing = true;
};

FMovieClip.prototype.gotoAndStop = function(frame)
{
    this.time = frame;
    this.playing = false;
    
    this._texture = this.textures[this.time];
};

/**
 * @protected
 */
FMovieClip.prototype.updateTransform = function()
{
    this.time += this.motionSpeed * Main.delta;
    
    if (this.playing)
    {
        const time = this.time | 0,
              n = this.stopFrame || this.textures.length;
        if (this.loop || time <= n) {
            this._texture = this.textures[time % this.textures.length];
        } else if (time >= n) {
            let complete = this.complete;
            this.complete = null;
            if (this.stopFrame) {
                this._texture = this.textures[this.stopFrame % this.textures.length];
            }
            if (complete) {
                complete();
            }
            complete = null;
        }
    }
    this.containerUpdateTransform();
};

FMovieClip.prototype.movieClipUpdateTransform = FMovieClip.prototype.updateTransform;
