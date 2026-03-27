import os
import re

base_dir = '/Users/1113790/Desktop/portal 3.0/portal/src'

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # restore h-[60px] on the pagination wrapper
            new_content = content.replace('<div className=" border-t border-gray-100', '<div className="h-[60px] border-t border-gray-100')
            new_content = new_content.replace('className="border-b border-[#F3F4F6] text-[13px] text-gray-900 hover:bg-[#F9FAFB] "', 'className="border-b border-[#F3F4F6] text-[13px] text-gray-900 hover:bg-[#F9FAFB]"')

            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
