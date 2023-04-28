import { Input, Prompt, Source, Outputs } from '../../nteract-presentational-components';
import { FunctionComponent } from 'react';
import AnsiUp from 'ansi_up';

type Props = {
    notebook: any
}

const NotebookRenderer: FunctionComponent<Props> = ({ notebook }) => {
    if (!notebook.cells) return <div>No cells</div>
    const cells = notebook.cells.map((cell: any, index: any) => {
        switch (cell.cell_type) {
            case 'code':
                return (
                    <div key={`cell-${index}`} style={{ marginBottom: '20px' }}>
                        <Input>
                            <Prompt counter={cell.execution_count || null} />
                            <Source language={"python"}>
                                {cell.source.join('')}
                            </Source>
                        </Input>
                        <Outputs>
                            {
                                cell.outputs.map((output: any, i: number) => (
                                    <CellOutput output={output} key={i} />
                                ))
                            }
                        </Outputs>
                    </div>
                );
            case 'markdown':
                return (
                    <div
                        key={`cell-${index}`}
                        style={{ marginBottom: '20px' }}
                        dangerouslySetInnerHTML={{ __html: cell.rendered }}
                    />
                );
            default:
                return null;
        }
    });

    return <div>{cells}</div>;
};

const CellOutput: FunctionComponent<{ output: any }> = ({ output }) => {
    if (output.output_type === 'stream') {
        return <pre>{(output.text || output['text/plain']).join('')}</pre>
    }
    else if (output.output_type === 'execute_result') {
        return <pre>{output.data?.['text/plain']?.join('')}</pre>
    }
    else if (output.output_type === 'error') {
        return <pre><span style={{color: 'darkred'}}>{output.ename}: {output.evalue+'\n'} {ansiToPlainText(output.traceback.join('\n'))}</span></pre>
        // return (
        //     <div dangerouslySetInnerHTML={{__html: ansiToHtml(output.traceback.join('\n'))}} style={{color: 'darkred'}} />
        // )
    }
    else {
        return <pre>Unsupported output type {output.output_type} {JSON.stringify(output)}</pre>
    }
}

function ansiToPlainText(ansi: string) {
    const ansi_up = new AnsiUp
    const html = ansi_up.ansi_to_html(ansi);
    let  a = removeSpanTagsKeepContent(html)
    a = a.split('&gt;').join('>')
    a = a.split('&lt;').join('<')
    a = a.split('&amp;').join('&')
    return a
}

function removeSpanTagsKeepContent(htmlString: string) {
    // Create a DOMParser object
    const parser = new DOMParser();
    
    // Parse the HTML string into a DOM object
    const doc = parser.parseFromString(htmlString, 'text/html');
    
    // Get all the span elements
    const spanElements = doc.querySelectorAll('span');
    
    // Loop through the span elements and unwrap their content
    for (const span of spanElements) {
      const parent = span.parentNode;
      while (span.firstChild) {
        parent?.insertBefore(span.firstChild, span);
      }
      parent?.removeChild(span);
    }
    
    // Convert the modified DOM object back into a string
    const serializer = new XMLSerializer();
    const newHtmlString = serializer.serializeToString(doc.body);
    
    // Remove the unnecessary <body> and </body> tags from the string
    return newHtmlString.slice(6, -7);
}

export default NotebookRenderer;