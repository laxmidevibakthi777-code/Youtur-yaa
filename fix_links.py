import os
import re

for path, dirs, files in os.walk('artifacts/youtur/src'):
    for file in files:
        if file.endswith('.tsx'):
            filepath = os.path.join(path, file)
            with open(filepath, 'r') as f:
                content = f.read()

            # Find <Link...>\n  <button className="...">...</button>\n</Link>
            # Pattern to match simple <Link> wrapping a <button>
            
            def replace_link_button(m):
                link_tag = m.group(1)
                button_class = m.group(2)
                button_content = m.group(3)
                # Combine link_tag and button_class
                new_link = link_tag.replace('>', f' className="{button_class}">')
                return f"{new_link}{button_content}</Link>"
                
            new_content = re.sub(r'(<Link[^>]*>)\s*<button className="([^"]*)">([\s\S]*?)</button>\s*</Link>', replace_link_button, content)
            
            def replace_link_span(m):
                link_tag = m.group(1)
                span_class = m.group(2)
                span_content = m.group(3)
                new_link = link_tag.replace('>', f' className="{span_class}">')
                return f"{new_link}{span_content}</Link>"
                
            new_content = re.sub(r'(<Link[^>]*>)\s*<span className="([^"]*)">([\s\S]*?)</span>\s*</Link>', replace_link_span, new_content)

            # Dashboard.tsx insight link
            new_content = re.sub(r'(<Link[^>]*>)\s*<button className="([^"]*)">\s*([^<]*)\s*</button>\s*</Link>', replace_link_button, new_content)

            # Profile.tsx and ForgotPassword.tsx might have different structures, just replace button inside link generically
            new_content = re.sub(r'<Link href="([^"]*)">\s*<button className="([^"]*)">([\s\S]*?)</button>\s*</Link>', r'<Link href="\1" className="\2">\3</Link>', new_content)
            new_content = re.sub(r'<Link href="([^"]*)">\s*<span className="([^"]*)">([\s\S]*?)</span>\s*</Link>', r'<Link href="\1" className="\2">\3</Link>', new_content)
            
            # ChannelSelection.tsx 
            new_content = re.sub(r'<Link href="([^"]*)">\s*<button className="([^"]*)">\s*([\s\S]*?)\s*</button>\s*</Link>', r'<Link href="\1" className="\2">\3</Link>', new_content)

            with open(filepath, 'w') as f:
                f.write(new_content)

print("Links fixed")
