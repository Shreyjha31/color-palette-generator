import React, { useState } from 'react';
import './App.css';
import html2canvas from 'html2canvas';

function App() {
  const [baseColor, setBaseColor] = useState('#ff0000');
  const [palette, setPalette] = useState([]);
  const [copyMessage, setCopyMessage] = useState('');
  const [bgColor, setBgColor] = useState('#ff0000');
  const [numColors, setNumColors] = useState(5);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const generatePalette = () => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      let shade = lightenDarkenColor(baseColor, i * 20 - 40);
      colors.push(shade);
    }
    setPalette(colors);
    setBgColor(baseColor);
  };

  const lightenDarkenColor = (col, amt) => {
    let usePound = false;
    if (col[0] === "#") {
      col = col.slice(1);
      usePound = true;
    }

    let num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    let g = ((num >> 8) & 0x00FF) + amt;
    let b = (num & 0x0000FF) + amt;

    r = Math.max(Math.min(255, r), 0);
    g = Math.max(Math.min(255, g), 0);
    b = Math.max(Math.min(255, b), 0);

    return (usePound ? "#" : "") + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const copyToClipboard = (color) => {
    navigator.clipboard.writeText(color);
    setCopyMessage(`Copied ${color} to clipboard!`);
    setBgColor(color);
    setTimeout(() => setCopyMessage(''), 2000);
  };

  const generateRandomBaseColor = () => {
    const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    setBaseColor(randomColor);
    generatePalette();
  };

  const copyPaletteToClipboard = () => {
    const allColors = palette.join('\n');
    navigator.clipboard.writeText(allColors);
    setCopyMessage('Copied entire palette to clipboard!');
  };

  const savePaletteAsImage = () => {
    html2canvas(document.querySelector(".palette")).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'color-palette.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const generateComplementary = () => {
    const compColor = lightenDarkenColor(baseColor, 180);
    setPalette([baseColor, compColor]);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const appStyle = {
    backgroundColor: isDarkMode ? '#333' : bgColor || '#ff0000',
    color: isDarkMode ? '#fff' : '#000',
  };

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : ''}`} style={appStyle}>
      <h1 style={{ color: bgColor ? '#fff' : '#000' }}>Color Palette Generator</h1>

      <div className="dashboard">
        <div className="control-panel">
          <div className="input-group">
            <label htmlFor="colorPicker">Base Color:</label>
            <input
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="numColors">Number of Colors:</label>
            <input
              type="number"
              value={numColors}
              onChange={(e) => setNumColors(Number(e.target.value))}
              min="1"
              max="10"
            />
          </div>

          <div className="button-group">
            <button onClick={generatePalette}>Generate Palette</button>
            <button onClick={generateRandomBaseColor}>Generate Random Palette</button>
            <button onClick={generateComplementary}>Generate Complementary Colors</button>
            <button onClick={copyPaletteToClipboard}>Copy Entire Palette</button>
            <button onClick={savePaletteAsImage}>Save Palette as Image</button>
            <button onClick={toggleDarkMode}>
              {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
          </div>
        </div>

        <div className="palette-preview">
          {copyMessage && <div className="copy-message">{copyMessage}</div>}
          <div className="palette">
            {palette.map((color, idx) => (
              <div
                key={idx}
                className="color-block"
                style={{ backgroundColor: color }}
                onClick={() => copyToClipboard(color)}
              >
                <span>{color}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
