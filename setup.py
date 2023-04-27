from setuptools import setup, find_packages

# read the contents of README.md
from pathlib import Path
this_directory = Path(__file__).parent
long_description = (this_directory / "README.md").read_text()

__version__ = '0.1.0'

setup(
    name='scriptaway',
    version=__version__,
    author="Jeremy Magland",
    author_email="jmagland@flatironinstitute.org",
    url="https://github.com/scratchrealm/scriptaway",
    description="A web-based tool for creating experiments and running Python scripts",
    long_description=long_description,
    long_description_content_type='text/markdown',
    packages=find_packages(),
    install_requires=[
        'click'
    ],
    entry_points={
        'console_scripts': [
            'scriptaway=scriptaway.cli:cli'
        ]
    }
)