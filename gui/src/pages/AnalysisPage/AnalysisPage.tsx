import { FunctionComponent, useMemo } from "react";
import Splitter from "../../components/Splitter";
import AnalysisControlPanel from "../AnalysisControlPanel";
import TabWidget from "../TabWidget/TabWidget";
import OpenedFileWindow from "./OpenedFileWindow";
import useOpenedFiles from "./useOpenedFiles";

type Props = {
    analysisId: string
    width: number
    height: number
}

const AnalysisPage: FunctionComponent<Props> = ({analysisId, width, height}) => {
    const initialControlPanelWidth = Math.max(200, Math.min(300, width / 6))

    const {openedFiles, currentFileIndex, openFile, closeFile, setCurrentFileIndex} = useOpenedFiles()

    const tabs = useMemo(() => {
        return openedFiles.map((f) => ({
            label: labelForRelativePath(f.relativePath),
            closeable: true,
            onClose: () => {
                closeFile(f.relativePath)
            }
        }))
    }, [openedFiles, closeFile])

    return (
        <Splitter
            width={width}
            height={height}
            direction="horizontal"
            initialPosition={initialControlPanelWidth}
        >
            <AnalysisControlPanel
                width={0}
                height={0}
                analysisId={analysisId}
                onOpenFile={openFile}
            />
            <TabWidget
                width={0}
                height={0}
                tabs={tabs}
                currentTabIndex={currentFileIndex}
                setCurrentTabIndex={setCurrentFileIndex}
            >
                {
                    openedFiles.map((f) => (
                        <OpenedFileWindow
                            key={f.relativePath}
                            relativePath={f.relativePath}
                            analysisId={analysisId}
                            width={0}
                            height={0}
                        />
                    ))
                }
            </TabWidget>  
        </Splitter>
    )
}

function labelForRelativePath(relativePath: string) {
    const parts = relativePath.split('/')
    if (parts.length === 0) return relativePath
    return parts[parts.length - 1]
}

export default AnalysisPage