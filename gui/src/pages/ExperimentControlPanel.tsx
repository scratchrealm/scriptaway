import { serviceQuery } from "@figurl/interface"
import { FunctionComponent, useCallback } from "react"
import { useAccessCode } from "../AccessCodeContext"
import Hyperlink from "../components/Hyperlink"
import { useStatusBar } from "../StatusBar/StatusBarContext"
import useRoute from "../useRoute"
import AccessCodeControl from "./AccessCodeControl"

type Props = {
    experimentId: string
    width: number
    height: number
}

const deleteExperimentTooltip = `When you delete an experiment, it is flagged as deleted on the server and it will not show up on the list of experiments. This operation can be undone by the administrator.`
const cloneExperimentTooltip = `When you clone an experiment, a new experiment is created with the same files and scripts.`

const ExperimentControlPanel: FunctionComponent<Props> = ({experimentId}) => {
    const {setRoute} = useRoute()
    const {accessCode} = useAccessCode()
    const {setStatusBarMessage} = useStatusBar()
    const handleClone = useCallback(() => {
        if (!accessCode) {
            alert('You must set an access code before you can clone an experiment.')
            return
        }
        // prompt the user if they are sure they want to clone this experiment
        if (!window.confirm('Are you sure you want to CLONE this experiment?')) return
        (async() => {
            const {result} = await serviceQuery('scriptaway', {
                type: 'clone_experiment',
                experiment_id: experimentId,
                access_code: accessCode
            }, {
                includeUserId: true
            })
            setRoute({page: 'experiment', experimentId: result.newExperimentId})
            setTimeout(() => {
                // provide a popup box that says that the experiment has been clone and you are not viewing the clone
                setStatusBarMessage(`Experiment has been cloned. You are now viewing the clone.`)
            }, 500)
        })()
    }, [experimentId, setRoute, setStatusBarMessage, accessCode])
    const handleDelete = useCallback(() => {
        if (!accessCode) {
            alert('You must set an access code before you can delete an experiment.')
            return
        }
        // prompt the user if they are sure they want to delete this experiment
        if (!window.confirm('Are you sure you want to DELETE this experiment?')) return
        (async() => {
            const {result} = await serviceQuery('scriptaway', {
                type: 'delete_experiment',
                experiment_id: experimentId,
                access_code: accessCode
            }, {
                includeUserId: true
            })
            if (result.success) {
                setRoute({page: 'home'})
                setTimeout(() => {
                    // provide a popup box that says that the experiment has been deleted
                    setStatusBarMessage(`Experiment has been deleted.`)
                }, 500)
            }
        })()
    }, [experimentId, setRoute, setStatusBarMessage, accessCode])
    return (
        <div style={{paddingLeft: 15, paddingTop: 15, fontSize: 14, userSelect: 'none'}}>
            <div><Hyperlink onClick={() => setRoute({page: 'home'})}>&#8592; Back to experiments</Hyperlink></div>
            <hr />
            <div>Experiment: {experimentId}</div>
            <hr />
            {/* A clickable link to clone this experiment: */}
            <div style={{lineHeight: 2}} title={cloneExperimentTooltip}><Hyperlink onClick={handleClone}>Clone this experiment</Hyperlink></div>
            {/* A clickable link to delete this experiment: */}
            <div style={{lineHeight: 2}} title={deleteExperimentTooltip}><Hyperlink color="darkred" onClick={handleDelete}>Delete this experiment</Hyperlink></div>
            <hr />
            <AccessCodeControl />
        </div>
    )
}

export default ExperimentControlPanel