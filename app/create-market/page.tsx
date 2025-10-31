'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import Sidebar from '../../components/Sidebar';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import DateTimePicker from '../../components/ui/DateTimePicker';
import MarketPreview from '../../components/MarketPreview';
import { CreateMarketForm, MarketFormErrors, MARKET_CATEGORIES } from '../../types/market';
import { usePredictionMarketWrite } from '../../hooks/useContracts';

export default function CreateMarket() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { createMarket, isPending, isConfirming, isConfirmed, error } = usePredictionMarketWrite();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<CreateMarketForm>({
    question: '',
    category: '',
    description: '',
    optionA: '',
    optionB: '',
    endDate: '',
    endTime: '',
    resolutionDelay: 24,
    minBetAmount: '0.01'
  });

  const [errors, setErrors] = useState<MarketFormErrors>({});

  const categoryOptions = MARKET_CATEGORIES.map(category => ({
    value: category,
    label: category
  }));

  const resolutionDelayOptions = [
    { value: '1', label: '1 hour' },
    { value: '6', label: '6 hours' },
    { value: '24', label: '24 hours' },
    { value: '72', label: '3 days' },
    { value: '168', label: '1 week' }
  ];

  const handleInputChange = (field: keyof CreateMarketForm, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: MarketFormErrors = {};

    if (stepNumber === 1) {
      if (!formData.question.trim()) {
        newErrors.question = 'Market question is required';
      } else if (formData.question.length < 10) {
        newErrors.question = 'Question must be at least 10 characters';
      }

      if (!formData.category) {
        newErrors.category = 'Category is required';
      }

      if (formData.description && formData.description.length > 500) {
        newErrors.description = 'Description must be less than 500 characters';
      }
    }

    if (stepNumber === 2) {
      if (!formData.optionA.trim()) {
        newErrors.optionA = 'Option A is required';
      }

      if (!formData.optionB.trim()) {
        newErrors.optionB = 'Option B is required';
      }

      if (formData.optionA.trim() === formData.optionB.trim()) {
        newErrors.optionB = 'Options must be different';
      }
    }

    if (stepNumber === 3) {
      if (!formData.endDate) {
        newErrors.endDate = 'End date is required';
      }

      if (!formData.endTime) {
        newErrors.endTime = 'End time is required';
      }

      if (formData.endDate && formData.endTime) {
        const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
        const now = new Date();
        
        if (endDateTime <= now) {
          newErrors.endDate = 'End date/time must be in the future';
        }

        if (endDateTime <= new Date(now.getTime() + 60 * 60 * 1000)) {
          newErrors.endTime = 'Market must run for at least 1 hour';
        }
      }

      if (!formData.minBetAmount || Number(formData.minBetAmount) <= 0) {
        newErrors.minBetAmount = 'Minimum bet amount must be greater than 0';
      }

      if (Number(formData.minBetAmount) > 10) {
        newErrors.minBetAmount = 'Minimum bet amount should not exceed 10 BNB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Creating market with data:', formData);
      
      // Calculate duration in seconds
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      const now = new Date();
      const duration = Math.floor((endDateTime.getTime() - now.getTime()) / 1000);
      
      // Convert resolution delay from hours to seconds
      const resolutionDelay = formData.resolutionDelay * 3600;
      
      // Create market on blockchain
      await createMarket(
        formData.question,
        formData.category,
        duration,
        resolutionDelay,
        formData.optionA,
        formData.optionB
      );
      
      // Wait for transaction confirmation
      if (isConfirmed) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error creating market:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-text-dark mb-2">
                Market Information
              </h2>
              <p className="text-text-muted-dark">
                Provide basic information about your prediction market.
              </p>
            </div>

            <Input
              label="Market Question"
              placeholder="e.g., Will Bitcoin reach $100k by end of 2024?"
              value={formData.question}
              onChange={(e) => handleInputChange('question', e.target.value)}
              error={errors.question}
              helperText="Ask a clear, specific question that can be objectively resolved"
              icon="help"
              required
            />

            <Select
              label="Category"
              options={categoryOptions}
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              error={errors.category}
              icon="category"
              required
            />

            <Textarea
              label="Description (Optional)"
              placeholder="Provide additional context, rules, or criteria for resolution..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              error={errors.description}
              helperText={`${formData.description.length}/500 characters`}
              maxLength={500}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-text-dark mb-2">
                Market Options
              </h2>
              <p className="text-text-muted-dark">
                Define the two possible outcomes for your market.
              </p>
            </div>

            <Input
              label="Option A"
              placeholder="e.g., Yes"
              value={formData.optionA}
              onChange={(e) => handleInputChange('optionA', e.target.value)}
              error={errors.optionA}
              icon="check_circle"
              required
            />

            <Input
              label="Option B"
              placeholder="e.g., No"
              value={formData.optionB}
              onChange={(e) => handleInputChange('optionB', e.target.value)}
              error={errors.optionB}
              icon="cancel"
              required
            />

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-0.5">lightbulb</span>
                <div className="text-sm">
                  <p className="text-text-dark font-medium mb-1">Tips for good options:</p>
                  <ul className="text-text-muted-dark space-y-1">
                    <li>• Keep options clear and mutually exclusive</li>
                    <li>• Avoid ambiguous or subjective terms</li>
                    <li>• Make sure outcomes can be objectively verified</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-text-dark mb-2">
                Market Settings
              </h2>
              <p className="text-text-muted-dark">
                Configure timing and betting parameters for your market.
              </p>
            </div>

            <DateTimePicker
              dateLabel="Betting End Date"
              timeLabel="Betting End Time"
              dateValue={formData.endDate}
              timeValue={formData.endTime}
              onDateChange={(value) => handleInputChange('endDate', value)}
              onTimeChange={(value) => handleInputChange('endTime', value)}
              dateError={errors.endDate}
              timeError={errors.endTime}
              required
            />

            <Select
              label="Resolution Delay"
              options={resolutionDelayOptions}
              value={formData.resolutionDelay.toString()}
              onChange={(e) => handleInputChange('resolutionDelay', Number(e.target.value))}
              error={errors.resolutionDelay}
              helperText="Time after betting ends before market can be resolved"
              icon="schedule"
              required
            />

            <Input
              label="Minimum Bet Amount (BNB)"
              type="number"
              step="0.001"
              min="0.001"
              max="10"
              placeholder="0.01"
              value={formData.minBetAmount}
              onChange={(e) => handleInputChange('minBetAmount', e.target.value)}
              error={errors.minBetAmount}
              helperText="Minimum amount users can bet on this market"
              icon="payments"
              required
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative flex min-h-screen w-full">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => router.back()}
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-surface-dark/50 dark:bg-surface-dark border border-white/10 text-text-muted-dark hover:text-text-dark hover:bg-white/5 transition-colors"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div>
                  <h1 className="font-display text-4xl font-bold tracking-tighter text-text-light dark:text-text-dark">
                    Create Market
                  </h1>
                  <p className="text-base font-normal text-text-light/70 dark:text-text-dark/70">
                    Create a new prediction market for your audience
                  </p>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center gap-4">
                {[1, 2, 3].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center gap-2">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                        step >= stepNumber
                          ? 'bg-primary text-background-dark'
                          : 'bg-surface-dark border border-white/10 text-text-muted-dark'
                      }`}
                    >
                      {stepNumber}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        step >= stepNumber ? 'text-text-dark' : 'text-text-muted-dark'
                      }`}
                    >
                      {stepNumber === 1 && 'Information'}
                      {stepNumber === 2 && 'Options'}
                      {stepNumber === 3 && 'Settings'}
                    </span>
                    {stepNumber < 3 && (
                      <div className="w-12 h-px bg-white/10 ml-2" />
                    )}
                  </div>
                ))}
              </div>
            </header>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form */}
              <div className="rounded-xl border border-white/10 bg-surface-dark/50 dark:bg-surface-dark p-6">
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                  <button
                    onClick={handleBack}
                    disabled={step === 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-dark border border-white/10 text-text-muted-dark hover:text-text-dark hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back
                  </button>

                  {step < 3 ? (
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-6 py-2 bg-primary text-background-dark text-sm font-bold rounded-lg shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
                    >
                      Next
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting || isPending || isConfirming || !isConnected}
                      className="flex items-center gap-2 px-6 py-2 bg-secondary text-background-dark text-sm font-bold rounded-lg shadow-lg shadow-secondary/20 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting || isPending || isConfirming ? (
                        <>
                          <span className="animate-spin material-symbols-outlined text-sm">refresh</span>
                          {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Creating...'}
                        </>
                      ) : !isConnected ? (
                        <>
                          <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
                          Connect Wallet
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">add</span>
                          Create Market
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Preview */}
              <div className="lg:sticky lg:top-8 h-fit">
                <MarketPreview formData={formData} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}