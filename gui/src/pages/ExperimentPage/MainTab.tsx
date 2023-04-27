import { FunctionComponent } from "react";
import { useAccessCode } from "../../AccessCodeContext";
import TextEditor from "../TextEditor";

type Props = {
    width: number
    height: number
    experimentId: string
    descriptionMdText: string | undefined
    setDescriptionMdText: (text: string) => void
    refreshDescriptionMdText: () => void
}

const MainTab: FunctionComponent<Props> = ({width, height, descriptionMdText, setDescriptionMdText, refreshDescriptionMdText}) => {
    const {accessCode} = useAccessCode()

    return (
        <TextEditor
            width={width}
            height={height}
            language="markdown"
            label="description.md"
            text={descriptionMdText}
            onSetText={setDescriptionMdText}
            onReload={refreshDescriptionMdText}
            wordWrap={true}
            readOnly={(accessCode ? false : true)}
        />
    )
}

export default MainTab