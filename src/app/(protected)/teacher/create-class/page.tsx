'use client'; 

import { useState } from 'react';
import Step1 from './steps/step1';
import Step2 from './steps/step2';
import Step3 from './steps/step3';

export default function CreateClassPage() {
	const [currentStep, setCurrentStep] = useState(1);
	const [classData, setClassData] = useState({});

	const next = (data: any) => {
		setClassData({ ...classData, ...data });
		setCurrentStep(currentStep + 1);
	};

	const back = () => setCurrentStep(currentStep - 1);

	return (
		<main>
			<h1>Tạo lớp học mới</h1>

			{currentStep === 1 && <Step1 onNext={next} data={classData} />}
			{currentStep === 2 && <Step2 onNext={next} onBack={back} data={classData}/>}
			{currentStep === 3 && <Step3 onNext={next} onBack={back} data={classData}/>}
		</main>
	);
}