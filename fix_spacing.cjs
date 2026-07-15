const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.jsx') || file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
let fixedCount = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Match tracking-wide, tracking-wider, tracking-widest, tracking-[...]
  let newContent = content.replace(/tracking-(wide|wider|widest|\[[0-9\.a-z]+\])/g, '');
  
  // Clean up any double spaces inside className
  newContent = newContent.replace(/className="([^"]+)"/g, (match, classes) => {
    return `className="${classes.replace(/\s+/g, ' ').trim()}"`;
  });
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Fixed:', file);
    fixedCount++;
  }
});

console.log('Total files fixed:', fixedCount);
