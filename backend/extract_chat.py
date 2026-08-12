import sys
from bs4 import BeautifulSoup

def extract_text(html_path):
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # ChatGPT conversation messages are usually in elements with specific classes,
    # but to be safe, we can extract all text and do some basic cleanup.
    # We can also look for elements with data-message-author-role attribute.
    messages = soup.find_all(attrs={"data-message-author-role": True})
    
    if not messages:
        # Fallback if the specific structure is not found
        text = soup.get_text(separator='\n', strip=True)
        print("Fallback Text Extraction (No message roles found):")
        # Print last 5000 chars as it might be at the end
        print(text[-5000:])
        return

    for msg in messages:
        role = msg.get('data-message-author-role')
        content = msg.get_text(separator='\n', strip=True)
        print(f"ROLE: {role}")
        print(f"CONTENT:\n{content}")
        print("-" * 40)

if __name__ == "__main__":
    extract_text(sys.argv[1])
