import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    
    const question = searchParams.get('question') || 'Prediction Market';
    const optionA = searchParams.get('optionA') || 'Option A';
    const optionB = searchParams.get('optionB') || 'Option B';
    const category = searchParams.get('category') || 'General';
    const template = searchParams.get('template') || 'default';
    const oddsA = searchParams.get('oddsA') || '50';
    const oddsB = searchParams.get('oddsB') || '50';

    // Create SVG image
    const svg = generateMarketSVG({
      question,
      optionA,
      optionB,
      category,
      template,
      oddsA: Math.round(Number(oddsA) / 100),
      oddsB: Math.round(Number(oddsB) / 100)
    });

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}

function generateMarketSVG({
  question,
  optionA,
  optionB,
  category,
  template,
  oddsA,
  oddsB
}: {
  question: string;
  optionA: string;
  optionB: string;
  category: string;
  template: string;
  oddsA: number;
  oddsB: number;
}) {
  const colors = getTemplateColors(template);
  const truncatedQuestion = question.length > 60 ? question.substring(0, 57) + '...' : question;
  
  return `
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .title-text { font-family: 'Inter', sans-serif; font-weight: bold; font-size: 36px; fill: ${colors.text}; }
          .category-text { font-family: 'Inter', sans-serif; font-weight: 600; font-size: 20px; fill: ${colors.accent}; }
          .option-text { font-family: 'Inter', sans-serif; font-weight: 600; font-size: 20px; fill: ${colors.text}; }
          .odds-text { font-family: 'Inter', sans-serif; font-weight: bold; font-size: 28px; fill: ${colors.accent}; }
          .brand-text { font-family: 'Inter', sans-serif; font-weight: bold; font-size: 32px; fill: ${colors.accent}; }
          .footer-text { font-family: 'Inter', sans-serif; font-size: 18px; fill: ${colors.textMuted}; }
        </style>
        ${template === 'gradient' ? `
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#101820;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#1D2939;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#101820;stop-opacity:1" />
          </linearGradient>
        ` : ''}
      </defs>
      
      <!-- Background -->
      <rect width="800" height="600" fill="${template === 'gradient' ? 'url(#bgGradient)' : colors.background}"/>
      
      <!-- Border -->
      ${template !== 'bold' ? `<rect x="4" y="4" width="792" height="592" fill="none" stroke="${colors.accent}" stroke-width="4"/>` : ''}
      
      <!-- Brand -->
      <text x="400" y="60" text-anchor="middle" class="brand-text">ParagraphMarket</text>
      
      <!-- Category -->
      <text x="400" y="100" text-anchor="middle" class="category-text">${category.toUpperCase()}</text>
      
      <!-- Question (multiline) -->
      ${wrapText(truncatedQuestion, 400, 160, 50, 'title-text', 600)}
      
      <!-- Option A -->
      <rect x="40" y="350" width="320" height="120" fill="${colors.optionBg}" stroke="${colors.border}" stroke-width="2"/>
      <text x="200" y="390" text-anchor="middle" class="odds-text">${oddsA}%</text>
      <text x="200" y="420" text-anchor="middle" class="option-text">${truncateText(optionA, 25)}</text>
      
      <!-- Option B -->
      <rect x="440" y="350" width="320" height="120" fill="${colors.optionBg}" stroke="${colors.border}" stroke-width="2"/>
      <text x="600" y="390" text-anchor="middle" class="odds-text">${oddsB}%</text>
      <text x="600" y="420" text-anchor="middle" class="option-text">${truncateText(optionB, 25)}</text>
      
      <!-- Footer -->
      <text x="400" y="560" text-anchor="middle" class="footer-text">Powered by ParagraphMarket • Prediction Markets</text>
    </svg>
  `;
}

function getTemplateColors(template: string) {
  switch (template) {
    case 'minimal':
      return {
        background: '#FFFFFF',
        text: '#101820',
        textMuted: '#666666',
        accent: '#00FFF0',
        optionBg: '#F0F0F0',
        border: '#E0E0E0'
      };
    case 'bold':
      return {
        background: '#00FFF0',
        text: '#101820',
        textMuted: '#333333',
        accent: '#101820',
        optionBg: 'rgba(16, 24, 32, 0.1)',
        border: '#101820'
      };
    case 'gradient':
    default:
      return {
        background: '#101820',
        text: '#E8E9EB',
        textMuted: '#98A2B3',
        accent: '#00FFF0',
        optionBg: '#1D2939',
        border: 'rgba(255, 255, 255, 0.1)'
      };
  }
}

function wrapText(text: string, x: number, y: number, lineHeight: number, className: string, maxWidth: number) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    // Rough estimation: 14px per character for 36px font
    if (testLine.length * 14 > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  
  return lines.map((line, index) => 
    `<text x="${x}" y="${y + (index * lineHeight)}" text-anchor="middle" class="${className}">${line}</text>`
  ).join('\n');
}

function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
}