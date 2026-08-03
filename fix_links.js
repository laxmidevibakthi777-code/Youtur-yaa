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
            if (file.endsWith('.tsx')) results.push(file);
        }
    });
    return results;
}

const files = walk('artifacts/youtur/src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace <Link href="..."> <button className="...">Content</button> </Link>
    // with <Link href="..." className="...">Content</Link>
    content = content.replace(/<Link\s+href="([^"]+)">\s*<button\s+className="([^"]+)">([\s\S]*?)<\/button>\s*<\/Link>/g, '<Link href="$1" className="$2">$3</Link>');
    content = content.replace(/<Link\s+href="([^"]+)">\s*<span\s+className="([^"]+)">([\s\S]*?)<\/span>\s*<\/Link>/g, '<Link href="$1" className="$2">$3</Link>');
    
    // Replace <Link href="..."> <div className="...">Content</div> </Link>
    content = content.replace(/<Link\s+href="([^"]+)">\s*<div\s+className="([^"]+)">([\s\S]*?)<\/div>\s*<\/Link>/g, '<Link href="$1" className="$2">$3</Link>');

    // For generic <Link ...> <button className="...">...
    content = content.replace(/<Link([^>]*)>\s*<button\s+className="([^"]+)">([\s\S]*?)<\/button>\s*<\/Link>/g, '<Link$1 className="$2">$3</Link>');
    content = content.replace(/<Link([^>]*)>\s*<span\s+className="([^"]+)">([\s\S]*?)<\/span>\s*<\/Link>/g, '<Link$1 className="$2">$3</Link>');
    
    // Specifically for Sidebar Layout.tsx <Link ...> <div className="...">
    content = content.replace(/<Link([^>]*)>\s*<div\s+className="([^"]+)"([^>]*)>([\s\S]*?)<\/div>\s*<\/Link>/g, '<Link$1 className="$2"$3>$4</Link>');
    
    fs.writeFileSync(file, content);
});

console.log("Links fixed");
