import pytest

from reana_jupyterlab.handlers.utils import is_allowed_reana_server, resolve_within


@pytest.mark.parametrize('url, allowed', [
    ('https://reana.cern.ch', True),
    ('http://example.org/api', True),
    ('ftp://reana.cern.ch', False),                # wrong scheme
    ('https://', False),                           # no host
    ('http://127.0.0.1', False),                   # loopback
    ('http://10.0.0.5', False),                    # private
    ('http://169.254.169.254', False),             # link-local (metadata)
    ('http://0.0.0.0', False),                     # unspecified
    ('http://224.0.0.1', False),                   # multicast
    ('http://[::1]', False),                        # ipv6 loopback
    ('http://[::ffff:169.254.169.254]', False),    # ipv4-mapped ipv6
    ('http://localhost', False),                   # blocked name
    ('http://metadata', False),                    # blocked name
    ('http://foo.local', False),                   # .local
])
def test_is_allowed_reana_server(url, allowed, monkeypatch):
    monkeypatch.delenv('REANA_ALLOWED_SERVER_HOSTS', raising=False)
    assert is_allowed_reana_server(url) is allowed


def test_allowlist_restricts_to_listed_hosts(monkeypatch):
    monkeypatch.setenv('REANA_ALLOWED_SERVER_HOSTS', 'reana.cern.ch, other.example')
    assert is_allowed_reana_server('https://reana.cern.ch') is True
    assert is_allowed_reana_server('https://other.example') is True
    assert is_allowed_reana_server('https://evil.example') is False
    # a public host that isn't on the list is still rejected
    assert is_allowed_reana_server('https://example.org') is False


@pytest.mark.parametrize('user_path', [
    '..',
    '../escaped.txt',
    'nested/../../escaped.txt',
    '/etc/passwd',
])
def test_resolve_within_rejects_paths_outside_the_base(tmp_path, user_path):
    with pytest.raises(ValueError):
        resolve_within(tmp_path, user_path)


@pytest.mark.parametrize('user_path', ['file.txt', 'nested/file.txt', './file.txt'])
def test_resolve_within_allows_paths_inside_the_base(tmp_path, user_path):
    assert resolve_within(tmp_path, user_path).is_relative_to(tmp_path.resolve())
