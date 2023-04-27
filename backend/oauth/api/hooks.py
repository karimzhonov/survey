def preprocessing_filter(endpoints):
    filtered = []
    for (path, path_regex, method, callback) in endpoints:
        if "api/oauth" in path:
            filtered.append((path, path_regex, method, callback))
    return filtered