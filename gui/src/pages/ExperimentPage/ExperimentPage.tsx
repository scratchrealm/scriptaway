import { FunctionComponent } from "react";
import ExperimentControlPanel from "../ExperimentControlPanel";
import TabWidget from "../TabWidget/TabWidget";
import useExperimentData from "../useExperimentData";
import MainTab from "./MainTab";

type Props = {
    experimentId: string
    width: number
    height: number
}

const ExperimentPage: FunctionComponent<Props> = ({experimentId, width, height}) => {
    // important to do this here just once rather than separately in the various editors
    const {descriptionMdText, setDescriptionMdText, refreshDescriptionMdText} = useExperimentData(experimentId)

    const controlPanelWidth = Math.max(200, Math.min(300, width / 6))

    return (
        <div>
            <div style={{position: 'absolute', width: controlPanelWidth, height}}>
                <ExperimentControlPanel
                    width={controlPanelWidth}
                    height={height}
                    experimentId={experimentId}
                />
            </div>
            <div style={{position: 'absolute', left: controlPanelWidth, width: width - controlPanelWidth, height}}>
            <TabWidget
                width={width - controlPanelWidth}
                height={height}
                tabs={[
                    {label: 'Main', closeable: false}
                ]}
            >
                <MainTab
                    width={0}
                    height={0}
                    experimentId={experimentId}
                    descriptionMdText={descriptionMdText}
                    setDescriptionMdText={setDescriptionMdText}
                    refreshDescriptionMdText={refreshDescriptionMdText}
                />
            </TabWidget>  
            </div>
        </div>
    )
}

export default ExperimentPage