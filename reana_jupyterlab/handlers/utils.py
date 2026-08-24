import ipaddress
import os
from pathlib import Path
from urllib.parse import urlparse

_BLOCKED_HOSTS = {'localhost', 'metadata', 'metadata.google.internal'}


def resolve_within(base, user_path):
    base = Path(base).resolve()
    target = (base / user_path).resolve()
    if not target.is_relative_to(base):
        raise ValueError(f'Path is outside {base}: {user_path}')
    return target


def is_allowed_reana_server(url):
    parsed = urlparse(url)
    if parsed.scheme not in ('http', 'https') or not parsed.hostname:
        return False
    host = parsed.hostname

    allowed = os.getenv('REANA_ALLOWED_SERVER_HOSTS', '')
    if allowed.strip():
        return host in {h.strip() for h in allowed.split(',') if h.strip()}

    try:
        ip = ipaddress.ip_address(host)
    except ValueError:
        # a name, not an IP -- don't resolve it, that's a DNS-rebinding hole
        return host.lower() not in _BLOCKED_HOSTS and not host.lower().endswith('.local')
    return not (ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved)
