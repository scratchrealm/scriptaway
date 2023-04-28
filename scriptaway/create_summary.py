import os
import json
import yaml
import time


def create_summary(dir: str):
    if not os.path.exists(f'{dir}/analyses'):
        os.makedirs(f'{dir}/analyses')

    analyses = []
    # Iterate through all the folders in the analyses directory
    folders = os.listdir(f'{dir}/analyses')
    folders.sort()
    for folder in folders:
        path = f'{dir}/analyses/{folder}'

        # read info from analysis.yaml file
        if os.path.exists(f'{path}/analysis.yaml'):
            with open(f'{path}/analysis.yaml') as f:
                info = yaml.load(f, Loader=yaml.FullLoader)
        else:
            info = {}
        
        # if deleted, skip
        if info.get('deleted', False):
            continue

        # read description from description.md file
        if os.path.exists(f'{path}/description.md'):
            with open(f'{path}/description.md') as f:
                description = f.read()
        else:
            description = ''
        
        title = _get_title_from_markdown(description)
        analyses.append({
            'analysis_id': folder,
            'title': title,
            'user_id': info.get('user_id', None),
            'info': info,
            'description': description
        })

    summary = {
        'analyses': analyses
    }
    
    # write analyses to summary.json file
    with open(f'{dir}/scriptaway_summary.json', 'w') as f:
        json.dump(summary, f, indent=2)

def create_summary_if_sufficient_time_passed(dir: str):
    summary_fname = f'{dir}/scriptaway_summary.json'
    refresh_needed = False
    if not os.path.exists(summary_fname):
        refresh_needed = True
    else:
        # check if sufficient time has passed
        modification_time = os.path.getmtime(summary_fname)
        if time.time() - modification_time > 60:
            refresh_needed = True
    if refresh_needed:
        create_summary(dir=dir)

def _get_title_from_markdown(markdown: str):
    # Extract the title from the markdown
    lines = markdown.split('\n')
    for line in lines:
        if line.startswith('#'):
            # skip all the initial # characters
            return line.lstrip('#').strip()
    return ''