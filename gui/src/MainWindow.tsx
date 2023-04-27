import { startListeningToParent, useWindowDimensions } from "@figurl/interface";
import { FunctionComponent } from "react";
import ExperimentPage from "./pages/ExperimentPage/ExperimentPage";
import Home from "./pages/Home";
import StatusBar from "./StatusBar/StatusBar";
import useRoute from "./useRoute";

const statusBarHeight = 25

const MainWindow: FunctionComponent = () => {
	const {route} = useRoute()
	const {width, height} = useWindowDimensions()
    return (
		<div style={{position: 'absolute', width, height, overflow: 'hidden'}}>
			<div style={{position: 'absolute', width, height: height - statusBarHeight}}>
				{
					route.page === 'home' ? (
						<Home width={width} height={height - statusBarHeight} />
					) : route.page === 'experiment' ? (
						<ExperimentPage experimentId={route.experimentId} width={width} height={height - statusBarHeight} />
					) : (
						<div>Unknown page: {(route as any).page}</div>
					)
				}
			</div>
			<div style={{position: 'absolute', top: height - statusBarHeight, width, height: statusBarHeight}}>
				<StatusBar width={width} height={statusBarHeight} />
			</div>
		</div>
	)
}

startListeningToParent()

export default MainWindow