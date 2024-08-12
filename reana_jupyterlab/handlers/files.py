import os
from jupyter_server.base.handlers import APIHandler

class FileBrowserHandler(APIHandler):
    async def get(self):
        relative_path = self.get_query_argument('path', '')
        path = os.path.join(os.getcwd(), relative_path)

        if '..' in path or not os.path.isdir(path):
            self.set_status(404)
            self.finish({"error": "Directory not found"})
            return

        entries = []
        for entry in os.listdir(path):
            entry_path = os.path.join(path, entry)
            if not entry.startswith('.') and (os.path.isdir(entry) or entry.endswith('.yaml')):
                rel_entry_path = os.path.join(relative_path, entry)
                entries.append({
                    "name": entry,
                    "type": "directory" if os.path.isdir(entry_path) else "file",
                    "path": rel_entry_path,
                })

        self.finish({"entries": entries})