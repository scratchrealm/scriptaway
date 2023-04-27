import { serviceQuery } from "@figurl/interface"
import { FunctionComponent, useCallback } from "react"
import { useAccessCode } from "../AccessCodeContext"
import Hyperlink from "../components/Hyperlink"
import FileBrowser from "../FileBrowser/FileBrowser"
import { useStatusBar } from "../StatusBar/StatusBarContext"
import useRoute from "../useRoute"

type Props = {
    analysisId: string
    onOpenFile: (relativePath: string) => void
    width: number
    height: number
}

const deleteAnalysisTooltip = `When you delete an analysis, it is flagged as deleted on the server and it will not show up on the list of analyses. This operation can be undone by the administrator.`
const cloneAnalysisTooltip = `When you clone an analysis, a new analysis is created with the same files and scripts.`

const AnalysisControlPanel: FunctionComponent<Props> = ({analysisId, onOpenFile, width, height}) => {
    const {setRoute} = useRoute()
    const {accessCode} = useAccessCode()
    const {setStatusBarMessage} = useStatusBar()
    const handleClone = useCallback(() => {
        if (!accessCode) {
            alert('You must set an access code before you can clone an analysis.')
            return
        }
        // prompt the user if they are sure they want to clone this analysis
        if (!window.confirm('Are you sure you want to CLONE this analysis?')) return
        (async() => {
            const {result} = await serviceQuery('scriptaway', {
                type: 'clone_analysis',
                analysis_id: analysisId,
                access_code: accessCode
            }, {
                includeUserId: true
            })
            setRoute({page: 'analysis', analysisId: result.newAnalysisId})
            setTimeout(() => {
                // provide a popup box that says that the analysis has been clone and you are not viewing the clone
                setStatusBarMessage(`Analysis has been cloned. You are now viewing the clone.`)
            }, 500)
        })()
    }, [analysisId, setRoute, setStatusBarMessage, accessCode])
    const handleDelete = useCallback(() => {
        if (!accessCode) {
            alert('You must set an access code before you can delete an analysis.')
            return
        }
        // prompt the user if they are sure they want to delete this analysis
        if (!window.confirm('Are you sure you want to DELETE this analysis?')) return
        (async() => {
            const {result} = await serviceQuery('scriptaway', {
                type: 'delete_analysis',
                analysis_id: analysisId,
                access_code: accessCode
            }, {
                includeUserId: true
            })
            if (result.success) {
                setRoute({page: 'home'})
                setTimeout(() => {
                    // provide a popup box that says that the analysis has been deleted
                    setStatusBarMessage(`Analysis has been deleted.`)
                }, 500)
            }
        })()
    }, [analysisId, setRoute, setStatusBarMessage, accessCode])

    const handleOpenFile = useCallback((path: string) => {
        onOpenFile(path.slice(`$dir/analyses/${analysisId}/`.length))
    }, [onOpenFile, analysisId])

    const topAreaHeight = 80
    const bottomAreaHeight = 80
    return (
        <div style={{position: 'absolute', width, height, overflowY: 'hidden'}}>
            <div style={{paddingLeft: 15, paddingTop: 15, fontSize: 14, userSelect: 'none'}}>
                <div><Hyperlink onClick={() => setRoute({page: 'home'})}>&#8592; Back to analyses</Hyperlink></div>
                <hr />
                <div>Analysis: {analysisId}</div>
                <hr />
            </div>
            <div style={{position: 'absolute', top: topAreaHeight, width, height: height - topAreaHeight - bottomAreaHeight, overflowY: 'auto'}}>
                <FileBrowser
                    currentFolderPath={`$dir/analyses/${analysisId}`}
                    setCurrentFolderPath={() => {}} // do nothing
                    onOpenFile={handleOpenFile} // do nothing
                />
            </div>
            <div style={{paddingLeft: 15, paddingTop: 15, fontSize: 14, userSelect: 'none', position: 'absolute', top: height - bottomAreaHeight}}>
                {/* A clickable link to clone this analysis: */}
                <div style={{lineHeight: 2}} title={cloneAnalysisTooltip}><Hyperlink onClick={handleClone}>Clone this analysis</Hyperlink></div>
                {/* A clickable link to delete this analysis: */}
                <div style={{lineHeight: 2}} title={deleteAnalysisTooltip}><Hyperlink color="darkred" onClick={handleDelete}>Delete this analysis</Hyperlink></div>
            </div>
        </div>
    )
}

export default AnalysisControlPanel