import os

image_dir = r'c:\Users\saksa\OneDrive\Desktop\ecommerce\ecommerce\frontend\images'
html_path = r'c:\Users\saksa\OneDrive\Desktop\ecommerce\ecommerce\frontend\images\gallery.html'

images = [f for f in os.listdir(image_dir) if f.endswith('.png') or f.endswith('.jpg')]

with open(html_path, 'w', encoding='utf-8') as f:
    f.write('<html><body>\n')
    for img in images:
        f.write(f'<h2>{img}</h2><img src="{img}" style="max-width: 800px;" /><br/>\n')
    f.write('</body></html>\n')
