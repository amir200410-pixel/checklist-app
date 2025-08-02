#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
import time

# נתונים משותפים
shared_data = {
    'appUsers': [],
    'manager-tasks': [],
    'transferRequests': []
}

# קובץ לשמירת נתונים
DATA_FILE = 'shared_data.json'

def load_data():
    """טעינת נתונים מקובץ"""
    global shared_data
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                shared_data = json.load(f)
            print(f"✅ נתונים נטענו: {len(shared_data.get('appUsers', []))} משתמשים")
        except Exception as e:
            print(f"❌ שגיאה בטעינת נתונים: {e}")

def save_data():
    """שמירת נתונים לקובץ"""
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(shared_data, f, ensure_ascii=False, indent=2)
        print(f"💾 נתונים נשמרו: {len(shared_data.get('appUsers', []))} משתמשים")
    except Exception as e:
        print(f"❌ שגיאה בשמירת נתונים: {e}")

class DataHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        """טיפול בבקשות GET"""
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        if path == '/':
            # דף הבית
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            with open('welcome.html', 'r', encoding='utf-8') as f:
                self.wfile.write(f.read().encode('utf-8'))
                
        elif path.endswith('.html'):
            # קבצי HTML
            try:
                with open(path[1:], 'r', encoding='utf-8') as f:
                    content = f.read()
                
                self.send_response(200)
                self.send_header('Content-type', 'text/html; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(content.encode('utf-8'))
            except FileNotFoundError:
                self.send_error(404, 'File not found')
                
        elif path.endswith('.css'):
            # קבצי CSS
            try:
                with open(path[1:], 'r', encoding='utf-8') as f:
                    content = f.read()
                
                self.send_response(200)
                self.send_header('Content-type', 'text/css; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(content.encode('utf-8'))
            except FileNotFoundError:
                self.send_error(404, 'File not found')
                
        elif path.endswith('.js'):
            # קבצי JavaScript
            try:
                with open(path[1:], 'r', encoding='utf-8') as f:
                    content = f.read()
                
                self.send_response(200)
                self.send_header('Content-type', 'application/javascript; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(content.encode('utf-8'))
            except FileNotFoundError:
                self.send_error(404, 'File not found')
                
        elif path == '/api/data':
            # API לקבלת נתונים
            self.send_response(200)
            self.send_header('Content-type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                'success': True,
                'data': shared_data,
                'timestamp': time.time()
            }
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
            
        elif path == '/api/status':
            # API לסטטוס שרת
            self.send_response(200)
            self.send_header('Content-type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            status = {
                'server': 'running',
                'users': len(shared_data.get('appUsers', [])),
                'tasks': len(shared_data.get('manager-tasks', [])),
                'transfers': len(shared_data.get('transferRequests', [])),
                'timestamp': time.time()
            }
            self.wfile.write(json.dumps(status, ensure_ascii=False).encode('utf-8'))
            
        else:
            # קבצים אחרים
            try:
                with open(path[1:], 'rb') as f:
                    content = f.read()
                
                self.send_response(200)
                self.send_header('Content-type', 'application/octet-stream')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(content)
            except FileNotFoundError:
                self.send_error(404, 'File not found')

    def do_POST(self):
        """טיפול בבקשות POST"""
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        if path == '/api/save':
            # API לשמירת נתונים
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                key = data.get('key')
                value = data.get('value')
                
                if key and key in shared_data:
                    shared_data[key] = value
                    save_data()
                    
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json; charset=utf-8')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    
                    response = {
                        'success': True,
                        'message': f'נתונים נשמרו: {key}',
                        'timestamp': time.time()
                    }
                    self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
                else:
                    self.send_error(400, 'Invalid key')
                    
            except Exception as e:
                self.send_error(500, f'Server error: {str(e)}')
                
        else:
            self.send_error(404, 'Not found')

    def do_OPTIONS(self):
        """טיפול בבקשות OPTIONS (CORS)"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, format, *args):
        """התאמת הודעות לוג"""
        print(f"🌐 {self.address_string()} - {format % args}")

def auto_save():
    """שמירה אוטומטית כל 30 שניות"""
    while True:
        time.sleep(30)
        save_data()

if __name__ == '__main__':
    # טעינת נתונים קיימים
    load_data()
    
    # הפעלת שמירה אוטומטית
    save_thread = threading.Thread(target=auto_save, daemon=True)
    save_thread.start()
    
    # הגדרת שרת
    server_address = ('0.0.0.0', 3000)
    httpd = HTTPServer(server_address, DataHandler)
    
    print(f"🚀 שרת מתחיל על {server_address[0]}:{server_address[1]}")
    print(f"📱 כתובת רשת: http://192.168.1.8:3000")
    print(f"💾 נתונים משותפים: {len(shared_data.get('appUsers', []))} משתמשים")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 שרת נעצר...")
        save_data()
        httpd.server_close() 