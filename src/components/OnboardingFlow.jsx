import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const [responses, setResponses] = useState({
    name: '',
    currentAndNext: '',
    weakness: '',
    impacts: []
  });

  const weaknessOptions = [
    'I struggle to speak infront of groups',
    'I struggle in formal conversations',
    'I am unable to share my thoughts clearly & concisely',
    'I find it difficult to speak spontaneously'
  ];

  const impactOptions = [
    'Building professional networks',
    'Advancing in my career and professional growth',
    'Maintaining personal relationships',
    'Developing confidence and self-belief'
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(`/videos/audio${step}.mp3`);
    audioRef.current = audio;
    audio.play();
    setIsPlaying(true);

    audio.addEventListener('ended', () => setIsPlaying(false));

    if (videoRef.current) {
      videoRef.current.play().catch(error => console.error('Video play error:', error));
    }

    return () => {
      audio.pause();
      audio.removeEventListener('ended', () => setIsPlaying(false));
      
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [step]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const requestBody = {
        Name: responses.name,
        First: responses.currentAndNext,
        Second: responses.weakness,
        Third: responses.impacts.join(', ')
      };
  
      const response = await fetch('https://contractus.co.in/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const responseData = await response.json();
      
      // Save the persona from the response with the token name 'persona'
      localStorage.setItem('persona', responseData.persona);
  
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      navigate('/artofconversation');
    } catch (error) {
      console.error('Error submitting responses:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleNext = () => {
    if (step === 4) {
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleImpactToggle = (impact) => {
    setResponses(prev => ({
      ...prev,
      impacts: prev.impacts.includes(impact)
        ? prev.impacts.filter(i => i !== impact)
        : [...prev.impacts, impact]
    }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return responses.name.trim().length > 0;
      case 2: return responses.currentAndNext.trim().length > 0;
      case 3: return responses.weakness !== '';
      case 4: return responses.impacts.length > 0;
      default: return false;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
        <div className="w-full max-w-xs text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Personalizing Your Journey
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Crafting custom chapters based on your responses...
          </p>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse" style={{ width: '80%' }}></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Your Name";
      case 2: return "Elaborate your pain points";
      case 3: return "What challenges you the most?";
      case 4: return "Life Impacts";
      default: return "";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return "4 quick questions for a personalized learning path";
      case 2: return "Share the problems you are facing and what you want to achieve";
      case 3: return "Select the most pressing issue?";
      case 4: return "Select areas where communication has held you back";
      default: return "";
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={responses.name}
                onChange={(e) => setResponses(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 text-base bg-gray-200 border-b-2 border-gray-700 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-gray-800 transition-colors duration-300"
                placeholder="Your name..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-3">
            <div className="relative">
              <textarea
                value={responses.currentAndNext}
                onChange={(e) => setResponses(prev => ({ ...prev, currentAndNext: e.target.value }))}
                className="w-full px-4 py-3 text-base bg-gray-200 border-b-2 border-gray-700 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-gray-800 transition-colors duration-300 resize-none"
                rows={3}
                placeholder="I'm currently... and I want to..."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-2">
            {weaknessOptions.map((option) => (
              <div
                key={option}
                onClick={() => setResponses(prev => ({ ...prev, weakness: option }))}
                className={`p-3 border-2 border-gray-700 rounded-xl cursor-pointer transition-all duration-300 text-sm ${
                  responses.weakness === option
                    ? 'bg-gray-800 text-white'
                    : 'hover:bg-gray-200 text-gray-800'
                }`}
              >
                {option}
              </div>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-2">
            {impactOptions.map((option) => (
              <div
                key={option}
                onClick={() => handleImpactToggle(option)}
                className={`p-3 border-2 border-gray-700 rounded-xl cursor-pointer transition-all duration-300 flex justify-between items-center text-sm ${
                  responses.impacts.includes(option)
                    ? 'bg-gray-800 text-white'
                    : 'hover:bg-gray-200 text-gray-800'
                }`}
              >
                {option}
                {responses.impacts.includes(option) && (
                  <CheckCircle2 className="h-5 w-5 text-white" />
                )}
              </div>
            ))}
          </div>
        );
    }
  };

 
  return (
    <div className="onboarding-container relative min-h-screen">
      <video
        ref={videoRef}
        src="/videos/bg.mp4"
        className="absolute inset-0 w-full h-full object-cover z-0"
        loop
        muted
        autoPlay
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="logo-container mb-8">
          <img
            src="/logo.png"
            alt="Logo"
            className="logo w-24 h-24"
          />
          {isPlaying && (
            <div className="ripple" />
          )}
        </div>

        <div className="w-full max-w-xs bg-white rounded-2xl shadow-2xl border-2 border-gray-700 p-6 sm:p-8">
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4].map((number) => (
              <div
                key={number}
                className={`w-2 h-2 rounded-full mx-1 transition-all duration-300 ${
                  number === step
                    ? 'bg-gray-800 w-5'
                    : number < step
                    ? 'bg-gray-600'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              {getStepTitle()}
            </h2>
            <p className="text-sm text-gray-700">
              {getStepDescription()}
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {renderStep()}
          </div>

          <div className="flex justify-between mt-6 sm:mt-8">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-gray-200 transition-colors duration-300 text-sm border border-gray-700 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 border-2 border-gray-700 ${
                isStepValid()
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-600 cursor-not-allowed'
              }`}
            >
              {step === 4 ? 'Complete' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;