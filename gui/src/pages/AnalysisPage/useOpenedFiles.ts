import { useCallback, useReducer } from "react"

type OpenedFile = {
    relativePath: string
}

type OpenedFilesState = {
    openedFiles: OpenedFile[]
    currentFileIndex: number | undefined
}

type OpenedFilesAction = {
    type: 'open'
    relativePath: string
} | {
    type: 'close'
    relativePath: string
} | {
    type: 'setCurrentFileIndex'
    currentFileIndex: number
}

const openedFilesReducer = (state: OpenedFilesState, action: OpenedFilesAction) => {
    switch (action.type) {
        case 'open': {
            const { relativePath } = action
            const ind = state.openedFiles.findIndex(f => (f.relativePath === relativePath))
            if (ind >= 0) {
                return {
                    ...state,
                    currentFileIndex: ind
                }
            }
            else {
                return {
                    ...state,
                    openedFiles: [...state.openedFiles, {relativePath}],
                    currentFileIndex: state.openedFiles.length
                }
            }
        }
        case 'close': {
            const { relativePath } = action
            const index = state.openedFiles.findIndex(f => (f.relativePath === relativePath))
            if (index < 0) {
                return state
            }
            const openedFiles = [...state.openedFiles]
            openedFiles.splice(index, 1)
            return {
                ...state,
                openedFiles,
                currentFileIndex: (state.currentFileIndex === index) ? 0 : state.currentFileIndex
            }
        }
        case 'setCurrentFileIndex': {
            const { currentFileIndex } = action
            if (currentFileIndex === state.currentFileIndex) {
                return state
            }
            return {
                ...state,
                currentFileIndex
            }
        }
        default: {
            throw new Error(`Unexpected action type: ${(action as any).type}`)
        }
    }
}

const useOpenedFiles = () => {
    const [openedFilesState, openedFilesDispatch] = useReducer(openedFilesReducer, {openedFiles: [], currentFileIndex: undefined})

    const openFile = useCallback((relativePath: string) => {
        openedFilesDispatch({type: 'open', relativePath})
    }, [openedFilesDispatch])

    const closeFile = useCallback((relativePath: string) => {
        openedFilesDispatch({type: 'close', relativePath})
    }, [openedFilesDispatch])

    const setCurrentFileIndex = useCallback((currentFileIndex: number) => {
        openedFilesDispatch({type: 'setCurrentFileIndex', currentFileIndex})
    }, [openedFilesDispatch])

    return {
        openedFiles: openedFilesState.openedFiles,
        currentFileIndex: openedFilesState.currentFileIndex,
        openFile,
        closeFile,
        setCurrentFileIndex
    }
}

export default useOpenedFiles