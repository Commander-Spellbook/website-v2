import { Canvas, CanvasRenderingContext2D, createCanvas, loadImage } from 'canvas';
import { VariantsApi } from '@spacecowmedia/spellbook-client';
import { apiConfiguration } from 'services/api.service';
import { NextApiRequest, NextApiResponse } from 'next';
import scryfall from 'scryfall-client';
import serverPath from 'lib/serverPath';

const width = 1080;
const manaOffset = width / 25;
const iWidth = (width * 32) / 500;
const border = width / 125;
const leftOffset = width / 50;
const lineOffset = width / 20;
const fontSize = iWidth / 2;
const fontFamily = 'Noto Sans';
const headerHeight = iWidth + lineOffset;
const footerHeight = (width * 9) / 100;
const padding = leftOffset;

async function headerCanvas(identityArray: any[]) {
  // Mana pips background
  let canvas1 = createCanvas(width, headerHeight);
  let ctx = canvas1.getContext('2d');
  ctx.fillStyle = '#333';
  ctx.fillRect(border, border, canvas1.width - border * 2, canvas1.height - border * 2);
  let startManaPos = width / 2 - ((identityArray.length - 1) * (iWidth + manaOffset) + iWidth) / 2;
  for (let [index, letter] of identityArray.entries()) {
    let position = index * (iWidth + manaOffset) + startManaPos;
    let img = await loadImage(scryfall.getSymbolUrl(letter));
    ctx.drawImage(img, position, manaOffset / 2, iWidth, iWidth);
  }
  return canvas1;
}

function cardsUsedCanvas(cards: string | any[]) {
  // Cards Used
  let canvas2 = createCanvas(width, cards.length * lineOffset + border);
  let ctx = canvas2.getContext('2d');
  ctx.fillStyle = '#222';
  ctx.font = `${fontSize}px ${fontFamily}`;
  let nextLine = lineOffset;
  for (let card of cards) {
    ctx.fillText(card.name, leftOffset, nextLine);
    nextLine = nextLine + lineOffset;
  }
  return canvas2;
}

function preReqCanvas(prereqCount: number, templateCount: number) {
  // more pre-reqs
  let canvas3 = createCanvas(width, lineOffset + border * 2);
  let ctx = canvas3.getContext('2d');
  ctx.fillStyle = '#6B7280';
  ctx.font = `${fontSize - 2}px ${fontFamily}`;
  ctx.fillText(
    `${templateCount > 0 ? `+${templateCount} card${templateCount > 1 ? 's' : ''}\n` : ''}+${prereqCount} other prerequisite${prereqCount > 1 ? 's' : ''}`,
    leftOffset,
    lineOffset,
  );
  return canvas3;
}

function separatorCanvas() {
  // Separator line between card names and abilities
  let canvas4 = createCanvas(width, border);
  let ctx = canvas4.getContext('2d');
  let nextLine = 0;
  ctx.strokeStyle = '#6B7280';
  ctx.lineWidth = border / 2;
  ctx.beginPath();
  ctx.moveTo(border, nextLine);
  ctx.lineTo(width - border, nextLine);
  ctx.stroke();
  return canvas4;
}

function comboOutcomesCanvas(produces: any[]) {
  // Combo Outcomes
  let canvasHeight = produces.length * lineOffset + border;
  let canvas5 = createCanvas(width, canvasHeight);
  let ctx = canvas5.getContext('2d');
  ctx.fillStyle = '#222';
  ctx.font = `${fontSize}px ${fontFamily}`;
  let nextLine = lineOffset;
  produces.forEach((product) => {
    ctx.fillText(product.feature.name, leftOffset, nextLine);
    nextLine = nextLine + lineOffset;
  });
  return canvas5;
}

async function footerCanvas() {
  // Commander Spellbook at the bottom
  let canvas6 = createCanvas(width, footerHeight);
  let ctx = canvas6.getContext('2d');
  ctx.fillStyle = '#333';
  ctx.fillRect(border, border, width - border * 2, footerHeight - border * 2);
  let text = 'Commander Spellbook';
  const gear = await loadImage(serverPath('public/images/gear.svg'));
  ctx.fillStyle = '#866da8';
  ctx.font = `bold ${fontSize}px ${fontFamily}`;
  const textSize = ctx.measureText(text);
  const totalWidth = iWidth + textSize.width + padding;
  const startX = (canvas6.width - totalWidth) / 2;
  const startY = (canvas6.height - iWidth) / 2;
  let nextLine = (canvas6.height - fontSize) / 2 + fontSize - border;
  ctx.drawImage(gear, startX, startY, iWidth, iWidth);
  ctx.fillText(text, startX + iWidth + padding, nextLine);
  return canvas6;
}

function drawImage(ctx: CanvasRenderingContext2D, canvas: Canvas, yPos: number) {
  ctx.drawImage(canvas, 0, yPos);
  return yPos + canvas.height;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const configuration = apiConfiguration();
  const variantsApi = new VariantsApi(configuration);
  try {
    const combo = await variantsApi.variantsRetrieve({ id: req.query.id as string });
    if (!combo) {
      return res.status(404).json({ error: 'Combo not found' });
    }
    const identityArray = combo.identity.split('');
    const cards = combo.uses.map((item) => item.card);
    const templateCount = combo.requires.length;
    const prereqCount = combo.otherPrerequisites.split('\n').length;
    const produces = combo.produces;

    let header_c = await headerCanvas(identityArray);
    let cardsUsed_c = cardsUsedCanvas(cards);
    let prereq_c = preReqCanvas(prereqCount, templateCount);
    let separator_c = separatorCanvas();
    let produces_c = comboOutcomesCanvas(produces);
    let footer_c = await footerCanvas();

    let calcHeight =
      header_c.height + cardsUsed_c.height + prereq_c.height + separator_c.height + produces_c.height + footer_c.height;
    const canvas = createCanvas(width, calcHeight);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(border, border, canvas.width - border * 2, canvas.height - border * 2);
    let nextLine = drawImage(ctx, header_c, 0);
    nextLine = drawImage(ctx, cardsUsed_c, nextLine);
    nextLine = drawImage(ctx, prereq_c, nextLine);
    nextLine = drawImage(ctx, separator_c, nextLine);
    nextLine = drawImage(ctx, produces_c, nextLine);
    drawImage(ctx, footer_c, nextLine);

    res.setHeader('Content-Type', 'image/png');
    const buffer = canvas.toBuffer('image/png');
    res.send(buffer);
  } catch (error) {
    console.error('Error fetching variants:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
}
