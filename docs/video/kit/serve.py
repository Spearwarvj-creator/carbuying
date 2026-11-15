#!/usr/bin/env python3
"""A tiny static server for the video kit that never caches, so an edit shows up on the next reload.
Run from this folder:  python3 serve.py   (default port 8765; pass another number to change it)."""
import http.server
import socketserver
import sys


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, *args):  # keep the terminal quiet while recording
        pass


socketserver.ThreadingTCPServer.allow_reuse_address = True
port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
with socketserver.ThreadingTCPServer(("", port), Handler) as server:
    print(f"Deal Desk video kit: http://localhost:{port}/index.html  (Ctrl+C to stop)")
    server.serve_forever()
