import { getFileData, serviceQuery } from "@figurl/interface"
import YAML from 'js-yaml'
import { useCallback, useEffect, useMemo, useState } from "react"
import { useAccessCode } from "../AccessCodeContext"

export type ExperimentInfo = {
    status: 'none' | 'requested' | 'queued' | 'running' | 'completed' | 'failed'
    error?: string
}

export const useExperimentTextFile = (experimentId: string, name: string) => {
    const [internalText, setInternalText] = useState<string | undefined>(undefined)
    const [refreshCode, setRefreshCode] = useState(0)
    const {accessCode} = useAccessCode()
    useEffect(() => {
        (async () => {
            setInternalText(undefined)
            try {
                const a = await readTextFile(`$dir/experiments/${experimentId}/${name}`)
                setInternalText(a)
            }
            catch (err) {
                console.warn(err)
                setInternalText('')
            }
        })()
    }, [experimentId, name, refreshCode])
    const refresh = useCallback(() => {
        setRefreshCode(c => (c + 1))
    }, [])
    const setText = useCallback((text: string) => {
        if (!accessCode) {
            window.alert(`You must set an access code to edit this file.`)
            return
        }
        (async () => {
            await serviceQuery('scriptaway', {
                type: 'set_experiment_text_file',
                experiment_id: experimentId,
                name,
                text,
                access_code: accessCode
            }, {
                includeUserId: true
            })
            setRefreshCode(c => (c + 1))
        })()
    }, [experimentId, name, accessCode])
    return {text: internalText, refresh, setText}
}

const useExperimentData = (experimentId: string) => {
    const {text: descriptionMdText, setText: setDescriptionMdText, refresh: refreshDescriptionMdText} = useExperimentTextFile(experimentId, 'description.md')
    const {text: experimentInfoText, refresh: refreshExperimentInfo} = useExperimentTextFile(experimentId, 'experiment.yaml')

    const experimentInfo = useMemo(() => {
        if (!experimentInfoText) return undefined
        try {
            return YAML.load(experimentInfoText) as ExperimentInfo
        }
        catch (err) {
            console.warn('Problem loading yaml')
            console.warn(err)
            return undefined
        }
    }, [experimentInfoText])

    return {
        descriptionMdText,
        experimentInfo,
        setDescriptionMdText,
        refreshDescriptionMdText,
        refreshExperimentInfo
    }
}

const readTextFile = async (path: string) => {
    const a = await getFileData(path, () => {}, {responseType: 'text'})
    return a as string
}

export default useExperimentData