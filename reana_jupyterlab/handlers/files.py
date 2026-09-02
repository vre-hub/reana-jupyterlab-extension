import os
from pathlib import Path

import tornado.web
from jupyter_server.base.handlers import APIHandler

from .utils import resolve_within


class FileBrowserHandler(APIHandler):
    @tornado.web.authenticated
    async def get(self):
        relative_path = self.get_query_argument('path', '')

        try:
            path = str(resolve_within(Path.cwd(), relative_path))
        except ValueError:
            self.set_status(404)
            self.finish({"error": "Directory not found"})
            return

        if not os.path.isdir(path):
            self.set_status(404)
            self.finish({"error": "Directory not found"})
            return

        entries = []
        for entry in os.listdir(path):
            entry_path = os.path.join(path, entry)
            if not entry.startswith('.') and (os.path.isdir(entry_path) or entry.endswith('.yaml')):
                rel_entry_path = os.path.join(relative_path, entry)
                entries.append({
                    "name": entry,
                    "type": "directory" if os.path.isdir(entry_path) else "file",
                    "path": rel_entry_path,
                })

        self.finish({"entries": entries})
