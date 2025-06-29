"use client";


import React from 'react';
import { ChevronRight, CheckCircle } from 'lucide-react';
import { StepIndicatorProps, Step } from '../types';

interface StepIndicatorExtendedProps extends StepIndicatorProps {
  errors?: { [key: string]: string };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  showDescription?: boolean;
  clickable?: boolean;
  onStepClick?: (stepId: number) => void;
}

const StepIndicator: React.FC<StepIndicatorExtendedProps> = ({ 
  steps, 
  currentStep,
  errors = {},
  className = '',
  size = 'md',
  showDescription = true
}) => {
  
  // Size configurations for Fast Company style
  const sizeConfig = {
    sm: {
      container: 'w-8 h-8',
      icon: 'w-4 h-4',
      title: 'text-xs',
      spacing: 'space-x-2 space-x-reverse'
    },
    md: {
      container: 'w-10 h-10',
      icon: 'w-5 h-5',
      title: 'text-sm',
      spacing: 'space-x-4 space-x-reverse'
    },
    lg: {
      container: 'w-12 h-12',
      icon: 'w-6 h-6',
      title: 'text-base',
      spacing: 'space-x-6 space-x-reverse'
    }
  };

  const config = sizeConfig[size];

  // Render individual step
  const renderStep = (step: Step, index: number) => {
    const isActive = currentStep === step.id;
    const isCompleted = currentStep > step.id;
    const Icon = step.icon;
    
    return (
      <React.Fragment key={step.id}>
        <div className="flex flex-col items-center">
          {/* Step Circle - Fast Company Style */}
          <div className={`
            ${config.container} 
            rounded-full flex items-center justify-center border-2 transition-all duration-300
            ${isCompleted 
              ? 'bg-black border-black text-white' 
              : isActive 
              ? 'bg-orange-500 border-orange-500 text-white' 
              : 'bg-white border-gray-300 text-gray-400'
            }
          `}>
            {isCompleted ? (
              <CheckCircle className={config.icon} />
            ) : (
              <Icon className={config.icon} />
            )}
          </div>
          
          {/* Step Title */}
          <div className="mt-2 text-center">
            <p className={`
              ${config.title} font-medium transition-colors duration-300
              ${isActive ? 'text-orange-500' : isCompleted ? 'text-black' : 'text-gray-500'}
            `}>
              {step.title}
            </p>
            
            {/* Optional Description */}
            {showDescription && step.description && (
              <p className="text-xs text-gray-400 mt-1 max-w-20">
                {step.description}
              </p>
            )}
          </div>
        </div>
        
        {/* Connector Line */}
        {index < steps.length - 1 && (
          <div className={`flex-1 h-px mx-4 transition-colors duration-300 ${
            currentStep > step.id ? 'bg-black' : 'bg-gray-200'
          }`} />
        )}
      </React.Fragment>
    );
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <div className="flex items-center max-w-2xl w-full">
        {steps.map((step, index) => renderStep(step, index))}
      </div>
    </div>
  );
};

export default StepIndicator;