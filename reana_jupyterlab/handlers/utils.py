from pathlib import Path


def resolve_within(base, user_path):
    base = Path(base).resolve()
    target = (base / user_path).resolve()
    if not target.is_relative_to(base):
        raise ValueError(f'Path is outside {base}: {user_path}')
    return target
