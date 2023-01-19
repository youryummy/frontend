import fs from 'fs';

export default function saveImage(req, res) {
  const { image } = req.body;
  const base64Data = image.replace(/^data:([A-Za-z-+/]+);base64,/, '');
  const path = req.query.path;
  if (!fs.existsSync("public/recipes")) fs.mkdirSync("public/recipes");
  fs.writeFileSync(`public${path}`, Buffer.from(base64Data, "base64"));
  res.status(201).send({ path });
}