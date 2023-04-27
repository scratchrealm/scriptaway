import os
import json
import yaml


def create_summary(dir: str):
    if not os.path.exists(f'{dir}/experiments'):
        os.makedirs(f'{dir}/experiments')

    experiments = []
    # Iterate through all the folders in the experiments directory
    folders = os.listdir(f'{dir}/experiments')
    folders.sort()
    for folder in folders:
        path = f'{dir}/experiments/{folder}'

        # read info from experiment.yaml file
        if os.path.exists(f'{path}/experiment.yaml'):
            with open(f'{path}/experiment.yaml') as f:
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
        experiments.append({
            'experiment_id': folder,
            'title': title,
            'user_id': info.get('user_id', None),
            'info': info,
            'description': description
        })

    summary = {
        'experiments': experiments
    }
    
    # write experiments to summary.json file
    with open(f'{dir}/summary.json', 'w') as f:
        json.dump(summary, f, indent=2)

def _get_title_from_markdown(markdown: str):
    # Extract the title from the markdown
    lines = markdown.split('\n')
    for line in lines:
        if line.startswith('#'):
            # skip all the initial # characters
            return line.lstrip('#').strip()
    return ''