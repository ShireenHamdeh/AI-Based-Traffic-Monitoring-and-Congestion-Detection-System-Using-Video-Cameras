import sys
import logging
import json
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from ultralytics import YOLO
import yt_dlp
import cv2
from datetime import datetime  # Import for timestamp

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)

# Load the YOLO model
model = YOLO('./best.pt')

@app.route('/api/track', methods=['GET'])
def track_objects():
    youtube_url = request.args.get('url')

    if not youtube_url:
        return jsonify({"message": "YouTube URL is missing"}), 400

    def get_stream_url(url):
        """Get the direct video stream URL using yt_dlp."""
        ydl_opts = {
            'format': 'bestvideo[height<=720][ext=mp4]',
            'quiet': True,
            'no_warnings': True
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(url, download=False)
            return info_dict['url']

    def generate():
        frame_counter = 0
        frame_rate = 30  # Assuming 30 FPS
        unique_vehicle_ids = set()  # Store unique IDs for each second

        try:
            # Get the direct video stream URL
            video_url = get_stream_url(youtube_url)
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
            return

        cap = cv2.VideoCapture(video_url)
        if not cap.isOpened():
            yield f"data: {json.dumps({'error': 'Unable to open video stream'})}\n\n"
            return

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            frame_counter += 1
            frame_ids = []  # IDs for this frame
            frame_classes = []  # Class labels for this frame

            # Run YOLO on each frame
            results = model.track(source=frame, conf=0.3, iou=0.2, tracker="./bytetrack.yaml")
            if results[0].boxes:
                for box in results[0].boxes:
                    byte_id = int(box.id) if box.id is not None else None
                    cls = int(box.cls)

                    if byte_id is not None:
                        unique_vehicle_ids.add(byte_id)  # Add the ID to the set
                        frame_ids.append(byte_id)
                        frame_classes.append(cls)

            # Print details of the current frame
            print(f"Frame {frame_counter}: Detected Track IDs: {frame_ids}, Class Labels: {frame_classes}")

            # After every 30 frames (1 second), print the results
            if frame_counter % frame_rate == 0:  # Every 30 frames
                current_time = datetime.now().strftime("%H:%M:%S")  # Get current time
                yield f"data: {json.dumps({'timestamp': current_time, 'unique_vehicles': len(unique_vehicle_ids)})}\n\n"
                print(f"Time {current_time}: {len(unique_vehicle_ids)} unique vehicles detected.")
                unique_vehicle_ids.clear()  # Reset the set for the next second

        cap.release()

    return Response(generate(), content_type="text/event-stream")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)


'''
import sys
import logging
import json
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from ultralytics import YOLO
import yt_dlp
import cv2

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)

# Load the YOLO model
model = YOLO('./best.pt')

@app.route('/api/track', methods=['GET'])
def track_objects():
    youtube_url = request.args.get('url')

    if not youtube_url:
        return jsonify({"message": "YouTube URL is missing"}), 400

    def get_stream_url(url):
        """Get the direct video stream URL using yt_dlp."""
        ydl_opts = {
            'format': 'bestvideo[height<=720][ext=mp4]',
            'quiet': True,
            'no_warnings': True
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(url, download=False)
            return info_dict['url']

    def generate():
        frame_counter = 0
        frame_rate = 30  # Assuming 30 FPS
        unique_vehicle_ids = set()  # Store unique IDs for each second

        try:
            # Get the direct video stream URL
            video_url = get_stream_url(youtube_url)
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
            return

        cap = cv2.VideoCapture(video_url)
        if not cap.isOpened():
            yield f"data: {json.dumps({'error': 'Unable to open video stream'})}\n\n"
            return

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            frame_counter += 1
            frame_ids = []  # IDs for this frame
            frame_classes = []  # Class labels for this frame

            # Run YOLO on each frame
            results = model.track(source=frame, conf=0.3, iou=0.2, tracker="./bytetrack.yaml")
            if results[0].boxes:
                for box in results[0].boxes:
                    byte_id = int(box.id) if box.id is not None else None
                    cls = int(box.cls)

                    if byte_id is not None:
                        unique_vehicle_ids.add(byte_id)  # Add the ID to the set
                        frame_ids.append(byte_id)
                        frame_classes.append(cls)

            # Print details of the current frame
            print(f"Frame {frame_counter}: Detected Track IDs: {frame_ids}, Class Labels: {frame_classes}")

            # After every 30 frames (1 second), print the results
            if frame_counter % frame_rate == 0:  # Every 30 frames
                current_second = frame_counter // frame_rate
                yield f"data: {json.dumps({'second': current_second, 'unique_vehicles': len(unique_vehicle_ids)})}\n\n"
                print(f"Second {current_second}: {len(unique_vehicle_ids)} unique vehicles detected.")
                unique_vehicle_ids.clear()  # Reset the set for the next second

        cap.release()

    return Response(generate(), content_type="text/event-stream")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
'''





'''
#code with byte track 
import sys
import logging
import json
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from ultralytics import YOLO
import yt_dlp
import cv2

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)

# Load the YOLO model
model = YOLO('./best.pt')

@app.route('/api/track', methods=['GET'])
def track_objects():
    youtube_url = request.args.get('url')

    if not youtube_url:
        return jsonify({"message": "YouTube URL is missing"}), 400

    def get_stream_url(url):
        """Get the direct video stream URL using yt_dlp."""
        ydl_opts = {
            'format': 'bestvideo[height<=720][ext=mp4]',
            'quiet': True,
            'no_warnings': True
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(url, download=False)
            return info_dict['url']

    def generate():
        frame_counter = 0

        try:
            # Get the direct video stream URL
            video_url = get_stream_url(youtube_url)
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
            return

        cap = cv2.VideoCapture(video_url)
        if not cap.isOpened():
            yield f"data: {json.dumps({'error': 'Unable to open video stream'})}\n\n"
            return

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            frame_counter += 1
            logging.info(f"Processing frame {frame_counter}")

            # Run YOLO on each frame
            results = model.track(source=frame, conf=0.1, iou=0.2, tracker="./bytetrack.yaml")
            frame_ids = []
            frame_classes = []

            if results[0].boxes:
                for box in results[0].boxes:
                    byte_id = int(box.id) if box.id is not None else None
                    cls = int(box.cls)

                    frame_ids.append(byte_id)
                    frame_classes.append(cls)

            # Print frame-level details
            print(f"Frame {frame_counter}: Detected Track IDs: {frame_ids}, Class Labels: {frame_classes}")

            # Send frame results
            frame_info = {
                "frame": frame_counter,
                "track_ids": frame_ids if frame_ids else ["No detections"],
                "class_labels": frame_classes if frame_classes else ["No detections"]
            }
            yield f"data: {json.dumps(frame_info)}\n\n"

        cap.release()

    return Response(generate(), content_type="text/event-stream")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
'''








'''
import sys
import io
import logging
import json
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from ultralytics import YOLO
import yt_dlp
import cv2

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)

model = YOLO('./best.pt')

@app.route('/api/track', methods=['GET'])
def track_objects():
    youtube_url = request.args.get('url')

    if not youtube_url:
        return jsonify({"message": "YouTube URL is missing"}), 400

    def generate():
        frame_counter = 0

        try:
            ydl_opts = {
                'format': 'bestvideo[height<=720][ext=mp4]',
                'quiet': True,
                'no_warnings': True,
                'postprocessor_args': ['-vf', 'fps=10,scale=640:-1']
            }
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info_dict = ydl.extract_info(youtube_url, download=False)
                video_url = info_dict['url']
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
            return

        cap = cv2.VideoCapture(video_url)
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            frame_counter += 1
            logging.info(f"Processing frame {frame_counter}")

            results = model.predict(source=frame, conf=0.1, iou=0.2)
            frame_ids = []
            frame_classes = []

            if results[0].boxes:
                for box in results[0].boxes:
                    cls = int(box.cls)
                    frame_ids.append("Detected")
                    frame_classes.append(cls)

            frame_info = {
                "frame": frame_counter,
                "track_ids": frame_ids if frame_ids else ["No detections"],
                "class_labels": frame_classes if frame_classes else ["No detections"]
            }
            yield f"data: {json.dumps(frame_info)}\n\n"

        cap.release()

    return Response(generate(), content_type="text/event-stream")

if __name__ == '__main__':
    app.run(debug=True, port=5000)
'''




'''
#10frames
import sys
import io
import logging
import json
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from ultralytics import YOLO
import yt_dlp

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)

# Load the YOLO model and tracker configuration
model = YOLO('./best.pt')
tracker_config = './bytetrack.yaml'

# Initialize global variables
global_id_counter = 0
id_map = {}
vehicle_ids_total = set()

@app.route('/api/track', methods=['GET'])
def track_objects():
    youtube_url = request.args.get('url')

    if not youtube_url:
        return jsonify({"message": "YouTube URL is missing"}), 400

    def generate():
        global global_id_counter, id_map, vehicle_ids_total

        frame_counter = 0

        try:
            ydl_opts = {
                'format': 'bestvideo[height<=480][ext=mp4]',
                'quiet': True,
                'no_warnings': True
            }
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info_dict = ydl.extract_info(youtube_url, download=False)
                video_url = info_dict['url']
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
            return

        results = model.track(
            source=video_url,
            iou=0.3,
            conf=0.2,
            tracker=tracker_config,
            stream=True
        )

        for result in results:
            frame_counter += 1
            logging.info(f"Processing frame {frame_counter}")

            frame_ids = []
            frame_classes = []

            if result.boxes:
                for box in result.boxes:
                    if box.id is not None:
                        byte_id = int(box.id)
                        cls = int(box.cls)

                        if byte_id not in id_map:
                            global_id_counter += 1
                            id_map[byte_id] = global_id_counter

                        global_id = id_map[byte_id]
                        frame_ids.append(global_id)
                        frame_classes.append(cls)
                        vehicle_ids_total.add(global_id)

            frame_info = {
                "frame": frame_counter,
                "track_ids": frame_ids,
                "class_labels": frame_classes
            }
            yield f"data: {json.dumps(frame_info)}\n\n"

    return Response(generate(), content_type="text/event-stream")

if __name__ == '__main__':
    app.run(debug=True, port=5000)

'''


"""""
import sys
import io
import logging
import json
import time
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from ultralytics import YOLO
import yt_dlp
import cv2

app = Flask(__name__)
CORS(app)

# Load YOLO model
model = YOLO('./best.pt')
tracker_config = './bytetrack.yaml'

@app.route('/api/track', methods=['GET'])
def track_objects():
    youtube_url = request.args.get('url')

    if not youtube_url:
        return jsonify({"message": "YouTube URL is missing"}), 400

    def generate():
        frame_counter = 0  # Track the current frame count
        fps_target = 2  # استخراج فريمز بمعدل 2 إطار لكل ثانية

        # Step 1: Download video using yt-dlp
        try:
            ydl_opts = {'format': 'bestvideo[ext=mp4]', 'outtmpl': 'temp_video.mp4'}
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([youtube_url])
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
            return

        # Step 2: Process video using OpenCV
        cap = cv2.VideoCapture('temp_video.mp4')
        fps = cap.get(cv2.CAP_PROP_FPS)  # Get original FPS of the video
        frame_interval = int(fps / fps_target)  # Calculate frame interval for 2 FPS

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            frame_counter += 1

            # Process only frames at the specified interval
            if frame_counter % frame_interval != 0:
                continue

            # Run YOLO model on the frame
            results = model(frame)

            frame_ids = []
            frame_classes = []

            if results:
                for result in results:
                    if result.boxes:
                        for box in result.boxes:
                            if box.id is not None:
                                frame_ids.append(int(box.id))
                                frame_classes.append(int(box.cls))

            # Send results to client
            frame_info = {
                "frame": frame_counter,
                "track_ids": frame_ids,
                "class_labels": frame_classes
            }
            yield f"data: {json.dumps(frame_info)}\n\n"

        cap.release()

    return Response(generate(), content_type="text/event-stream")


if __name__ == '__main__':
    app.run(debug=True, port=5000)

"""


'''
import sys
import io
import logging
import json
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from ultralytics import YOLO
import yt_dlp

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Load the YOLO model and tracker configuration
model = YOLO('./best.pt')
tracker_config = './bytetrack.yaml'

# Initialize global variables
global_id_counter = 0  # Global counter for unique IDs
id_map = {}  # Map ByteTrack IDs to globally unique IDs
vehicle_ids_total = set()  # Set to store unique vehicle IDs across the entire video
@app.route('/api/data', methods=['GET'])
def get_data():
    data = {'message': 'Hello from Flask!'}
    return jsonify(data)

@app.route('/api/data', methods=['POST'])
def post_data():
    data = request.get_json()
    youtube_url = data.get('url')

    if youtube_url:
        return jsonify({"message": "YouTube URL received!", "url": youtube_url}), 200
    else:
        return jsonify({"message": "URL is missing"}), 400

@app.route('/api/track', methods=['GET'])
def track_objects():
    youtube_url = request.args.get('url')  # Get the YouTube URL from query parameters

    if not youtube_url:
        return jsonify({"message": "YouTube URL is missing"}), 400

    def generate():
        global global_id_counter, id_map, vehicle_ids_total  # Declare global variables

        frame_counter = 0  # Frame count tracker

        # Use yt-dlp to extract the video URL
        
        try:
            ydl_opts = {'format': 'bestvideo[ext=mp4]'}
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info_dict = ydl.extract_info(youtube_url, download=False)
                video_url = info_dict['url']
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
            return
        
                     
    
        # Run the model to track objects
        results = model.track(source=video_url, iou=0.5, tracker=tracker_config, stream=True)

        for result in results:
            frame_counter += 1
            frame_ids = []  # To store IDs for this frame
            frame_classes = []  # To store class labels for this frame

            # Detection results
            if result.boxes:  # If there are detected objects
                for box in result.boxes:
                    if box.id is not None:  # Check if the ID is valid
                        byte_id = int(box.id)  # ByteTrack ID
                        cls = int(box.cls)  # Object class

                        # Assign a globally unique ID if it's a new ByteTrack ID
                        if byte_id not in id_map:
                            global_id_counter += 1
                            id_map[byte_id] = global_id_counter

                        global_id = id_map[byte_id]  # Use the global ID
                        frame_ids.append(global_id)
                        frame_classes.append(cls)

                        # Track unique vehicle IDs
                        vehicle_ids_total.add(global_id)

            # Construct the frame information for the client
            frame_info = {
                "frame": frame_counter,
                "track_ids": frame_ids,
                "class_labels": frame_classes
            }
            yield f"data: {json.dumps(frame_info)}\n\n"

    # Return the response as a stream with event-stream content type
    return Response(generate(), content_type="text/event-stream")

if __name__ == '__main__':
    app.run(debug=True, port=5000)
'''   
  