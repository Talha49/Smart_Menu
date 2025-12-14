from flask import Flask, request, send_file
from rembg import remove
from PIL import Image
import io

app = Flask(__name__)

# Note: Vercel serverless functions using Flask usually handle the specific route implicitly 
# or via a catch-all. However, following the specific pattern requested:

@app.route('/api/remove-background', methods=['POST'])
def remove_background_handler():
    # Handle both direct file upload and re-processing form data
    if 'file' not in request.files:
        return {'error': 'No file part'}, 400
    
    file = request.files['file']
    if file.filename == '':
        return {'error': 'No selected file'}, 400
        
    if file:
        try:
            # Read the image
            input_image = Image.open(file.stream)
            
            # Remove background using rembg
            # Use 'u2net' (default) or 'u2netp' (lightweight) if memory issues occur
            output_image = remove(input_image)
            
            # Save to bytes
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
            return {'error': str(e)}, 500

# Vercel requires the app to be exposed variable named 'app'
if __name__ == '__main__':
    app.run(debug=True)
