import { getFileData } from "@figurl/interface"
import { useCallback, useEffect, useState } from "react"

export type Summary = {
    experiments: {
        experiment_id: string
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
            const s = await getFileData(`$dir/summary.json`, () => {}, {responseType: 'json'})
            setSummary(s)
        })()
    }, [refreshCode])

    const refreshSummary = useCallback(() => {
        setRefreshCode(c => (c + 1))
    }, [])

    return {summary, refreshSummary}
}

export default useSummary