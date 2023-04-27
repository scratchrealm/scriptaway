import { useUrlState } from "@figurl/interface"
import { useCallback, useMemo } from "react"

export type Route = {
    page: 'home'
} | {
    page: 'experiment'
    experimentId: string
}

const useRoute = () => {
    const {urlState, updateUrlState} = useUrlState()
    const route: Route = useMemo(() => {
        const p = urlState['path'] || ''
        if (p.startsWith('/experiment/')) {
            const a = p.split('/')
            const experimentId = a[2]
            return {
                page: 'experiment',
                experimentId
            }
        }
        else {
            return {
                page: 'home'
            }
        }
    }, [urlState])

    const setRoute = useCallback((r: Route) => {
        if (r.page === 'home') {
            updateUrlState({path: '/'})
        }
        else if (r.page === 'experiment') {
            updateUrlState({path: `/experiment/${r.experimentId}`})
        }
    }, [updateUrlState])

    return {
        route,
        setRoute
    }    
}

export default useRoute