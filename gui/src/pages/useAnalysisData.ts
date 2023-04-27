import { getFileData, serviceQuery } from "@figurl/interface"
import YAML from 'js-yaml'
import { useCallback, useEffect, useMemo, useState } from "react"
import { useAccessCode } from "../AccessCodeContext"

export type AnalysisInfo = {
    status: 'none' | 'requested' | 'queued' | 'running' | 'completed' | 'failed'
    error?: string
}

export const useAnalysisTextFile = (analysisId: string, name: string) => {
    const [internalText, setInternalText] = useState<string | undefined>(undefined)
    const [refreshCode, setRefreshCode] = useState(0)
    const {accessCode} = useAccessCode()
    useEffect(() => {
        (async () => {
            setInternalText(undefined)
            try {
                const a = await readTextFile(`$dir/analyses/${analysisId}/${name}`)
                setInternalText(a)
            }
            catch (err) {
                console.warn(err)
                setInternalText('')
            }
        })()
    }, [analysisId, name, refreshCode])
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
                type: 'set_analysis_text_file',
                analysis_id: analysisId,
                name,
                text,
                access_code: accessCode
            }, {
                includeUserId: true
            })
            setRefreshCode(c => (c + 1))
        })()
    }, [analysisId, name, accessCode])
    return {text: internalText, refresh, setText}
}

const useAnalysisData = (analysisId: string) => {
    const {text: descriptionMdText, setText: setDescriptionMdText, refresh: refreshDescriptionMdText} = useAnalysisTextFile(analysisId, 'description.md')
    const {text: analysisInfoText, refresh: refreshAnalysisInfo} = useAnalysisTextFile(analysisId, 'analysis.yaml')

    const analysisInfo = useMemo(() => {
        if (!analysisInfoText) return undefined
        try {
            return YAML.load(analysisInfoText) as AnalysisInfo
        }
        catch (err) {
            console.warn('Problem loading yaml')
            console.warn(err)
            return undefined
        }
    }, [analysisInfoText])

    return {
        descriptionMdText,
        analysisInfo,
        setDescriptionMdText,
        refreshDescriptionMdText,
        refreshAnalysisInfo
    }
}

const readTextFile = async (path: string) => {
    const a = await getFileData(path, () => {}, {responseType: 'text'})
    return a as string
}

export default useAnalysisData