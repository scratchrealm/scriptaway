import { FunctionComponent } from "react";
import Hyperlink from "../components/Hyperlink";
import useRoute from "../useRoute";
import './scientific-table.css';
import { Summary } from "./useSummary";

type Props = {
    summary: Summary
}

const ExperimentsTable: FunctionComponent<Props> = ({summary}) => {
    const {setRoute} = useRoute()

    const experiments = [...(summary.experiments || [])]
    // reverse the order of the experiments so that the most recent ones are at the top
    experiments.reverse()

    return (
        <div>
            <table className="scientific-table">
                <thead>
                    <tr>
                        <th>Experiment</th>
                        <th>Title</th>
                        <th>User</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {experiments.map(experiment => (
                        <tr key={experiment.experiment_id}>
                            <td>
                                <Hyperlink onClick={() => setRoute({page: 'experiment', experimentId: experiment.experiment_id})}>
                                    {experiment.experiment_id}
                                </Hyperlink>
                            </td>
                            <td>
                                <Hyperlink onClick={() => setRoute({page: 'experiment', experimentId: experiment.experiment_id})}>
                                    {experiment.title}
                                </Hyperlink>
                            </td>
                            <td>
                                {experiment.user_id || ''}
                            </td>
                            <td><span style={{fontSize: 11}}>{abbreviateString(removeFirstHeaderLineInMarkdown(experiment.description), 200)}</span></td>
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

export default ExperimentsTable