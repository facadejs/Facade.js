import base64
import json
import re

from sh import find

file_list = []

for filename in find('demos', '-type', 'f', '-name', '*.js').strip().split('\n'):

    file_list.append(dict(
        name=re.sub(r'^demos\/', '', filename),
        content=base64.b64encode(open(filename, 'r').read())
    ))

print 'var demos = {};'.format(json.dumps(file_list))
