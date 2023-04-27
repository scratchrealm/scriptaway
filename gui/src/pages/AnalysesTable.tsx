import { FunctionComponent } from "react";
import Hyperlink from "../components/Hyperlink";
import useRoute from "../useRoute";
import './scientific-table.css';
import { Summary } from "./useSummary";

type Props = {
    summary: Summary
}

const AnalysesTable: FunctionComponent<Props> = ({summary}) => {
    const {setRoute} = useRoute()

    const analyses = [...(summary.analyses || [])]
    // reverse the order of the analyses so that the most recent ones are at the top
    analyses.reverse()

    return (
        <div>
            <table className="scientific-table">
                <thead>
                    <tr>
                        <th>Analysis</th>
                        <th>Title</th>
                        <th>User</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {analyses.map(analysis => (
                        <tr key={analysis.analysis_id}>
                            <td>
                                <Hyperlink onClick={() => setRoute({page: 'analysis', analysisId: analysis.analysis_id})}>
                                    {analysis.analysis_id}
                                </Hyperlink>
                            </td>
                            <td>
                                <Hyperlink onClick={() => setRoute({page: 'analysis', analysisId: analysis.analysis_id})}>
                                    {analysis.title}
                                </Hyperlink>
                            </td>
                            <td>
                                {analysis.user_id || ''}
                            </td>
                            <td><span style={{fontSize: 11}}>{abbreviateString(removeFirstHeaderLineInMarkdown(analysis.description), 200)}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function removeFirstHeaderLineInMarkdown(text: string) {
    const lines = text.split('\n')
    if (lines.length === 0) return ''
    if (lines[0].startsWith('# ')) {
        return lines.slice(1).join('\n')
    }
    else {
        return text
    }
}

function abbreviateString(s: string, maxLength: number) {
    if (s.length <= maxLength) return s
    else return s.slice(0, maxLength) + '...'
}

export default AnalysesTable