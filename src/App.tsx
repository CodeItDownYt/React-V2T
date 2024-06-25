import React, { useState, useEffect } from "react";
import "regenerator-runtime/runtime"; //You Must import this before the react-speech-recognition itself
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Mic, Save, Stop, VolumeHigh } from "react-ionicons";

const App: React.FC = () => {
	const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
		useSpeechRecognition();
	const [language, setLanguage] = useState("en-US");
	const [charCount, setCharCount] = useState(0);

	useEffect(() => {
		const chars = transcript.replace(/\s+/g, "");
		setCharCount(chars.length);
	}, [transcript]);

	const handleStartRecording = () => {
		if (listening) {
			SpeechRecognition.stopListening();
		} else {
			SpeechRecognition.startListening({ continuous: true, language });
		}
	};

	const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setLanguage(event.target.value);
	};

	const handleSaveTranscript = () => {
		const blob = new Blob([transcript], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "transcript.txt";
		a.click();
		URL.revokeObjectURL(url);
	};

	const handleSpeakTranscript = () => {
		const utterance = new SpeechSynthesisUtterance(transcript);
		utterance.lang = language;
		window.speechSynthesis.speak(utterance);
	};

	if (!browserSupportsSpeechRecognition) {
		return <span>Your Browser doesn't support speech recognition.</span>;
	}

	return (
		<div className="w-full h-full grid place-items-center">
			<div className="xl:w-[25vw] lg:w-[40vw] md:w-[60vw] w-[90%] flex flex-col shadow-lg bg-white p-5 rounded-lg relative">
				<div className="w-full h-[200px] relative pb-2 pt-8 font-medium text-gray-900 leading-7">
					<Save
						onClick={transcript && handleSaveTranscript}
						cssClasses={`absolute top-0 left-0 ${
							transcript ? "cursor-pointer opacity-100" : "cursor-default opacity-50"
						} !fill-[#6c63fe]`}
					/>
					<VolumeHigh
						onClick={handleSpeakTranscript}
						cssClasses={`absolute bottom-0 left-0 ${
							transcript ? "cursor-pointer opacity-100" : "cursor-default opacity-50"
						} !fill-[#6c63fe]`}
					/>
					<select
						className="w-fit px-1 bg-gray-200 text-gray-600 font-medium rounded-lg absolute top-0 right-0 outline-none"
						onChange={handleLanguageChange}
						value={language}
					>
						<option value="en-US">English</option>
						<option value="es-ES">Spanish</option>
						<option value="fr-FR">French</option>
						<option value="de-DE">German</option>
					</select>
					<div className="h-[140px] pb-2 mt-2 pr-1 w-full overflow-y-auto">
						{transcript ? (
							transcript
						) : (
							<div className="absolute opacity-60 left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 font-bold text-[30px] text-center text-gray-500">
								Click On Start Recording
							</div>
						)}
					</div>
				</div>
				<div
					className={`mt-5 text-[#333] font-medium ${
						transcript ? "opacity-100" : "opacity-30"
					}`}
				>
					<p>Character Count: {charCount}</p>
				</div>
				<div className="flex w-full items-center gap-3 mt-5">
					<button
						className={`w-full flex gap-1 justify-center text-white font-medium rounded-md py-3 ${
							listening ? "bg-red-500" : "bg-[#6c63fe]"
						}`}
						onClick={handleStartRecording}
					>
						{listening ? (
							<Stop cssClasses={"!fill-white !text-white"} />
						) : (
							<Mic cssClasses={"!fill-white !text-white"} />
						)}
						{listening ? "Stop Recording" : "Start Recording"}
					</button>
					<button
						className="w-[30%] bg-gray-500 text-white font-medium rounded-md py-3"
						onClick={() => {
							SpeechRecognition.stopListening();
							resetTranscript();
						}}
					>
						Reset
					</button>
				</div>
			</div>
		</div>
	);
};

export default App;
