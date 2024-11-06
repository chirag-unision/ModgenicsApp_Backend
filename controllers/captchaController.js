const { createCanvas } = require("canvas");
const bcrypt = require("bcrypt");

const alternateCapitals = str =>
  [...str].map((char, i) => char[`to${i % 2 ? "Upper" : "Lower"}Case`]()).join("");

const randomText = () =>
  alternateCapitals(
      Math.random()
          .toString(36)
          .replace(/[^a-z0-9]+/g, '').substring(2, 8)
  );

const drawLines = (ctx) => {
  ctx.beginPath();
  ctx.moveTo(0, Math.random() * 50);
  ctx.lineTo(200 + Math.random() * 100, Math.random() * 200);

  ctx.stroke();
}

const FONTBASE = 200;
const FONTSIZE = 35;

const relativeFont = width => {
  const ratio = FONTSIZE / FONTBASE;
  const size = width * ratio;
  return `${size}px serif`;
};

const arbitraryRandom = (min, max) => Math.random() * (max - min) + min;

const randomRotation = (degrees = 15) => (arbitraryRandom(-degrees, degrees) * Math.PI) / 180;

const configureText = (ctx, width, height) => {
  ctx.font = relativeFont(width);
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  const text = randomText();
  ctx.globalCompositeOperation = "difference";
  ctx.strokeStyle = "white";
  ctx.strokeText(text, width / 2, height / 2);
  return text;
};

const generate = (width, height) => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx.rotate(randomRotation());
  const text = configureText(ctx, width, height);

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);
  drawLines(ctx);

  ctx.setTransform((Math.random() / 10) + 0.9,    //scalex
      0.1 - (Math.random() / 5),      //skewx
      0.1 - (Math.random() / 5),      //skewy
      (Math.random() / 10) + 0.9,     //scaley
      (Math.random() * 20) + 10,      //transx
      100);                           //transy

  return {
      image: canvas.toDataURL(),
      text: text
  };
};

exports.getCaptcha = async (req, res) => {
  const width = parseInt(req.params.width) || 200;
  const height = parseInt(req.params.height) || 100;
  const { image, text } = generate(width, height);
  bcrypt.hash(text, 10, (err, hash) => {
      if (err) {
          res.send({ error: 'Error generating the captcha. Please try again.' });
      } else {
          res.send({ image, hash });
      }
  });
}

exports.verifyCaptcha = async (req, res) => {
  const {captcha, hash} = req.body;
  
  bcrypt.compare(captcha, hash, (err, result) => {
    if (err) {
      res.send({ error: 'Error verifying the captcha. Please try again.' });
    } else {
        res.send({ status: true, result });
    }
  });
}

exports.updateScore = async (req, res) => {
  const {user} = req.body;
  const db= req.db;
  const users= db.users;

  try {
      const query = await users.increment('score', { by: 1, where: { email: user } });
      if (query) {
          res.status(200).json({ message: 'Score incremented successfully' });
      } else {
          res.status(401).json({ message: 'Failed to increment score' });
      }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
  }

}

exports.getScore = async (req, res) => {
  const {user} = req.body;
  const db= req.db;
  const users= db.users;

  try {
    const query = await users.findOne({ where: { email: user } });
    if (query) {
        res.status(200).json({ message: 'Login successful!', query });
    } else {
        res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
  }

}

