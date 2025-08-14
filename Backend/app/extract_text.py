import fitz #type: ignore

def extract_text(file_location):
    text = ""
        
    with fitz.open(file_location) as doc:
        for page in doc:
            text += page.get_text() #type:ignore
    return text
