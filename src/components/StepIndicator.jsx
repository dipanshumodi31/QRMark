import React from 'react';
import { CheckCircle } from 'lucide-react';

function StepIndicator({ steps, currentStep }) {
    return (
        <div className="mb-12">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        <div className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                                step.number < currentStep
                                    ? 'bg-green-500 text-white'
                                    : step.number === currentStep
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                            }`}>
                                {step.number < currentStep ? (
                                    <CheckCircle className="w-6 h-6" />
                                ) : (
                                    step.number
                                )}
                            </div>
                            <div className="mt-2 text-center">
                                <div className={`text-sm font-medium ${
                                    step.number <= currentStep
                                        ? 'text-gray-900 dark:text-white'
                                        : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                    {step.title}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {step.description}
                                </div>
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                                step.number < currentStep
                                    ? 'bg-green-500'
                                    : 'bg-gray-200 dark:bg-gray-700'
                            }`} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

export default StepIndicator;