from typing import Tuple, Union
import os
import yaml
import shutil
import time
from .create_summary import create_summary
from .generate_access_code import check_valid_access_code


class RtcsharePlugin:
    def initialize(context):
        context.register_service('scriptaway', ScriptawayService)

class ScriptawayService:
    def handle_query(query: dict, *, dir: str, user_id: Union[str, None]=None) -> Tuple[dict, bytes]:
        print(f'Request from user: {user_id}')
        type0 = query['type']

        access_code_required = True
        if type0 == 'test':
            access_code_required = False

        access_code_verified = False        
        if access_code_required:
            access_code = query.get('access_code', None)
            if not access_code:
                return {'success': False, 'error': 'Access code is required'}, b''
            if not check_valid_access_code(access_code, dir=_get_full_path('$dir', dir=dir)):
                return {'success': False, 'error': 'Invalid access code'}, b''
            access_code_verified = True
        
        if type0 == 'test':
            return {'success': True}, b''
        elif type0 == 'set_experiment_text_file':
            try:
                experiment_id = query['experiment_id']
                check_valid_experiment_id(experiment_id)
                name = query['name']
                text = query['text']
                if _valid_text_file_name(name):
                    path = f'$dir/experiments/{experiment_id}/{name}'
                    full_path = _get_full_path(path, dir=dir)
                    with open(full_path, 'w') as f:
                        f.write(text)
                    create_summary(dir=_get_full_path('$dir', dir=dir))
                    return {'success': True}, b''
                else:
                    raise Exception(f'Unexpected file name: {name}')
            except Exception as err:
                return {'success': False, 'error': str(err)}, b''
        elif type0 == 'clone_experiment':
            experiment_id = query['experiment_id']
            check_valid_experiment_id(experiment_id)
            new_experiment_id = _get_new_experiment_id(dir=_get_full_path('$dir', dir=dir))
            path = _get_full_path(f'$dir/experiments/{experiment_id}', dir=dir)
            path_new = _get_full_path(f'$dir/experiments/{new_experiment_id}', dir=dir)
            shutil.copytree(path, path_new)
            if os.path.exists(f'{path_new}/experiment.yaml'):
                os.remove(f'{path_new}/experiment.yaml')
            x = {
                'user_id': user_id
            }
            with open(f'{path_new}/experiment.yaml', 'w') as f:
                yaml.dump(x, f)
            create_summary(dir=_get_full_path('$dir', dir=dir))
            return {'newexperimentId': new_experiment_id}, b''
        elif type0 == 'delete_experiment':
            experiment_id = query['experiment_id']
            check_valid_experiment_id(experiment_id)
            info = _get_experiment_info(experiment_id, dir=dir)
            info['deleted'] = True
            _set_experiment_info(experiment_id, info, dir=dir)
            create_summary(dir=_get_full_path('$dir', dir=dir))
            return {'success': True}, b''
        elif type0 == 'create_experiment':
            new_experiment_id = _get_new_experiment_id(dir=_get_full_path('$dir', dir=dir))
            path = _get_full_path(f'$dir/experiments/{new_experiment_id}', dir=dir)
            os.makedirs(path)
            with open(f'{path}/description.md', 'w') as f:
                f.write('# Untitled')
            x = {
                'user_id': user_id
            }
            with open(f'{path}/experiment.yaml', 'w') as f:
                yaml.dump(x, f)
            create_summary(dir=_get_full_path('$dir', dir=dir))
            return {'newExperimentId': new_experiment_id}, b''
        else:
            raise Exception(f'Unexpected query type: {type0}')

def _get_new_experiment_id(*, dir: str) -> str:
    i = 1
    while True:
        # candidate experiment id is 0001, 0002, etc.
        experiment_id = f'{i:04d}'
        path = f'{dir}/experiments/{experiment_id}'
        if not os.path.exists(path):
            return experiment_id
        i += 1
        if i > 9999:
            raise Exception('Unable to find a new experiment id')

def _get_experiment_info(experiment_id: str, *, dir: str) -> dict:
    # for security, ensure that experiment_id is a valid id
    check_valid_experiment_id(experiment_id)
    path = f'$dir/experiments/{experiment_id}/experiment.yaml'
    full_path = _get_full_path(path, dir=dir)
    if not os.path.exists(full_path):
        return {}
    # load the yaml info
    with open(full_path, 'r') as f:
        text = f.read()
    info = yaml.safe_load(text)
    return info

def _set_experiment_info(experiment_id: str, info: dict, *, dir: str) -> None:
    # for security, ensure that experiment_id is a valid id
    check_valid_experiment_id(experiment_id)
    path = f'$dir/experiments/{experiment_id}/experiment.yaml'
    full_path = _get_full_path(path, dir=dir)
    text = yaml.safe_dump(info)
    with open(full_path, 'w') as f:
        f.write(text)

def _get_full_path(path: str, *, dir: str) -> str:
    if '..' in path: # for security
        raise Exception(f'Invalid path: {path}')
    if path == '$dir':
        path = dir
    elif path.startswith('$dir/'):
        if dir == 'rtcshare://':
            path = 'rtcshare://' + path[len("$dir/"):]
        else:
            path = f'{dir}/{path[len("$dir/"):]}'
    if not path.startswith('rtcshare://'):
        raise Exception(f'Invalid path: {path}')
    relpath = path[len('rtcshare://'):]
    fullpath = f'{os.environ["RTCSHARE_DIR"]}/{relpath}'
    return fullpath

def check_valid_experiment_id(experiment_id: str) -> None:
    return all(c.isalnum() or c == "_" for c in experiment_id)

def _valid_text_file_name(name: str) -> bool:
    valid_extensions = ['md', 'txt', 'json', 'yaml', 'yml', 'py']
    if not name.endswith(tuple(f'.{ext}' for ext in valid_extensions)):
        return False
    if '/' in name:
        return False
    if '..' in name:
        return False
    return True