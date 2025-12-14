from flask import Flask, request, send_file
from rembg import remove
from PIL import Image
import io
import os

app = Flask(__name__)

# Route must match the file path name in Vercel's 'api' folder structure
# If file is api/remove-background.py, Vercel routes /api/remove-background to it.
# Flask needs to match the incoming path.

@app.route('/api/remove-background', methods=['POST'])
def remove_background_handler():
    if 'file' not in request.files:
        return {'error': 'No file part'}, 400
    
    file = request.files['file']
    if file.filename == '':
        return {'error': 'No selected file'}, 400
        
    if file:
        try:
            input_image = Image.open(file.stream)
            output_image = remove(input_image)
            output_bytes = io.BytesIO()
            output_image.save(output_bytes, format='PNG')
            output_bytes.seek(0)
            
            return send_file(
                output_bytes, 
                mimetype='image/png',
                as_attachment=False,
                download_name='removed_bg.png'
            )
        except Exception as e:
            print(f"Error: {e}")
            return {'error': str(e)}, 500

if __name__ == '__main__':
    app.run(debug=True)
