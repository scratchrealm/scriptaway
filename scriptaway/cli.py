from typing import List
import click
import scriptaway


@click.group(help="scriptaway command line client")
def cli():
    pass

@click.command(help='Update the summary file for the GUI')
def update_summary():
    scriptaway.create_summary(dir='.')

@click.command(help='Generate a temporary access code for use in the GUI')
def generate_access_code():
    print(scriptaway.generate_access_code(dir='.'))

cli.add_command(update_summary)
cli.add_command(generate_access_code)