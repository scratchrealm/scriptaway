import { FunctionComponent } from "react"
import { useAccessCode } from "../../AccessCodeContext"
import TextEditor from "../TextEditor"
import { useAnalysisTextFile } from "../useAnalysisData"

type Props = {
    relativePath: string
    analysisId: string
    width: number
    height: number
}

const OpenedFileWindow: FunctionComponent<Props> = ({relativePath, analysisId, width, height}) => {
    const {accessCode} = useAccessCode()
    const {text, setText, refresh} = useAnalysisTextFile(analysisId, relativePath)
    return (
        <div className="OpenedFileWindow" style={{position: 'absolute', width, height}}>
            <TextEditor
                width={width}
                height={height}
                language={determineLanguageForFileName(relativePath)}
                label={relativePath}
                text={text}
                onSetText={setText}
                onReload={refresh}
                wordWrap={determineWordWrapForFileName(relativePath)}
                readOnly={(accessCode ? false : true)}
            />

        </div>
    )
}

function determineLanguageForFileName(relativePath: string): string {
    const parts = relativePath.split('.')
    const extension = parts[parts.length - 1]
    switch (extension) {
        case 'md':
            return 'markdown'
        case 'py':
            return 'python'
        case 'js':
            return 'javascript'
        case 'ts':
            return 'typescript'
        case 'cpp':
            return 'cpp'
        case 'h':
            return 'cpp'
        case 'hpp':
            return 'cpp'
        case 'html':
            return 'html'
        case 'css':
            return 'css'
        case 'json':
            return 'json'
        case 'yaml':
            return 'yaml'
        case 'yml':
            return 'yaml'
        case 'txt':
            return 'plaintext'
        default:
            return 'plaintext'
    }
}

function determineWordWrapForFileName(relativePath: string): boolean {
    const parts = relativePath.split('.')
    const extension = parts[parts.length - 1]
    switch (extension) {
        case 'md':
            return true
        case 'txt':
            return true
        case 'json':
            return true
        default:
            return false
    }
}

export default OpenedFileWindow