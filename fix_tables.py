import os
import re

base_dir = '/Users/1113790/Desktop/portal 3.0/portal/src'

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()

            original = content

            # Fix TH padding
            content = re.sub(r'className="px-[0-9]+ py-[0-9]+ (.*?text-\[11px\][^"]*)"', r'className="px-[14px] py-[10px] \1"', content)
            
            # Fix TD padding (find px-X py-X in td class)
            content = re.sub(r'<td className="px-[0-9]+ py-[0-9]+', '<td className="px-[14px] py-[12px]', content)
            content = re.sub(r'<td className="(.*?) px-[0-9]+ py-[0-9]+', r'<td className="\1 px-[14px] py-[12px]', content)
            
            # Remove flex-1 and h-[60px] from tr
            content = re.sub(r'flex-1 h-\[60px\]', '', content)
            content = re.sub(r'h-\[60px\]', '', content)
            
            # Fix Table hover color mapping
            content = re.sub(r'hover:bg-gray-50', 'hover:bg-[#F9FAFB]', content)
            
            # Fix border bottom to #F3F4F6 where it is different like F3F4F6
            content = re.sub(r'border-\[#F3F4F6\]', 'border-[#F3F4F6]', content)

            if original != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated: {path}")

print("Done")
