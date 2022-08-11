import { useTimer } from "./Timer"

function Timelapse() {
    const timer = Timer({
        startTime: 1500,
        endTime: 1600,
        step: 1000 * 60 * 60,
        frequency: 24
    })

    const timerData = timer.time;

    return (
		<div className="App">
			<div>
				{!timer.isPlaying ? <button onClick={timer.play}>Play</button> : <button onClick={timer.stop}>Stop</button>}
			</div>
		</div>
	)
}