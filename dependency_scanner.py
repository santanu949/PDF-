import os
import ast
import sys

def get_imports(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        try:
            tree = ast.parse(f.read(), filename=filepath)
        except SyntaxError:
            return set()

    imports = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                imports.add(alias.name.split('.')[0])
        elif isinstance(node, ast.ImportFrom):
            if node.module:
                imports.add(node.module.split('.')[0])
    return imports

def main():
    stdlib = sys.stdlib_module_names
    # add some commonly missed stdlib stuff if any
    
    backend_path = r'c:\Users\saanu\Downloads\pdf\PdfKit_backend-main\PdfKit_backend-main\backend\app'
    
    all_imports = set()
    for root, _, files in os.walk(backend_path):
        for file in files:
            if file.endswith('.py'):
                path = os.path.join(root, file)
                all_imports.update(get_imports(path))
                
    third_party = {imp for imp in all_imports if imp not in stdlib and imp != 'app'}
    print("Third-party imports found in source code:")
    for imp in sorted(third_party):
        print(imp)

if __name__ == '__main__':
    main()
