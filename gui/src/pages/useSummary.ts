import { getFileData, serviceQuery } from "@figurl/interface"
import { useCallback, useEffect, useState } from "react"

export type Summary = {
    analyses: {
        analysis_id: string
        title: string
        user_id?: string
        info: {
            user_id?: string
        }
        description: string
    }[]
}

const useSummary = () => {
    const [summary, setSummary] = useState<Summary | undefined>(undefined)
    const [refreshCode, setRefreshCode] = useState(0)
    useEffect(() => {
        setSummary(undefined)
        ;(async () => {

            // The purpose of probing the scriptaway initially is to have it update
            // the summary file if needed.
            try {
                await serviceQuery('scriptaway', {type: 'probe'})
            }
            catch (err) {
                console.error(err)
                console.warn('Problem probing scriptaway service.')
            }

            const s = await getFileData(`$dir/scriptaway_summary.json`, () => {}, {responseType: 'json'})
            setSummary(s)
        })()
    }, [refreshCode])

    const refreshSummary = useCallback(() => {
        setRefreshCode(c => (c + 1))
    }, [])

    return {summary, refreshSummary}
}

export default useSummary