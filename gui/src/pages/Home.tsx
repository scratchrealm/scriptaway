import { serviceQuery } from "@figurl/interface";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { useAccessCode } from "../AccessCodeContext";
import Hyperlink from "../components/Hyperlink";
import { useStatusBar } from "../StatusBar/StatusBarContext";
import AccessCodeControl from "./AccessCodeControl";
import ExperimentsTable from "./ExperimentsTable";
import useSummary from "./useSummary";

type Props = {
    width: number
    height: number
}

const Home: FunctionComponent<Props> = ({width, height}) => {
    const {summary, refreshSummary} = useSummary()
    const {accessCode} = useAccessCode()

    const {setStatusBarMessage} = useStatusBar()

    const handleCreateNewExperiment = useCallback(() => {
        if (!accessCode) {
            window.alert(`You must set an access code before creating a new experiment.`)
            return
        }
        // Confirm that user wants to create a new experiment
        if (!window.confirm('Create a new experiment?')) return
        (async () => {
            const {result} = await serviceQuery('scriptaway', {
                type: 'create_experiment',
                access_code: accessCode
            }, {
                includeUserId: true
            })
            if (!result.newExperimentId) throw new Error('Unexpected - no new experiment id')
            refreshSummary()
            setTimeout(() => {
                setStatusBarMessage(`New experiment has been created.`)
            }, 500)
        })()
    }, [refreshSummary, setStatusBarMessage, accessCode])

    const [takingLongerThanExpected, setTakingLongerThanExpected] = useState(false)
    useEffect(() => {
        const a = setTimeout(() => {
            setTakingLongerThanExpected(true)
        }, 2500)
        return () => {
            clearTimeout(a)
        }
    }, [])

    const padding = 20

    return (
        <div style={{position: 'absolute', left: padding, top: padding, width: width - padding * 2, height: height - padding * 2, overflowY: 'auto'}}>
            <h1>Scriptaway</h1>
            <div>
                <Hyperlink onClick={handleCreateNewExperiment}>Create new experiment</Hyperlink>
                &nbsp;|&nbsp;
                <Hyperlink onClick={refreshSummary}>Refresh table</Hyperlink>
                &nbsp;|&nbsp;
                <a href="https://github.com/scratchrealm/scriptaway/blob/main/README.md" target="_blank" rel="noopener noreferrer">View documentation</a>
            </div>
            {
                summary ? (
                    <ExperimentsTable summary={summary} />
                ) : (
                    !takingLongerThanExpected ? (
                        <div>Loading...</div>
                    ) : (
                        <div>Loading is taking longer than expected. You may want to try refreshing the page.</div>
                    )
                )
            }
            <AccessCodeControl />
        </div>
    )
}

export default Home