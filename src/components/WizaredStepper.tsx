import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import Button from "./Button";
import LineLoader from "./LineLoader";

/**
 * Context value for the stepper
 */
interface StepperContextType {
  /** Total number of steps in the wizard (zero-based index) */
  totalSteps: number;
  /** Setter function to update the total number of steps */
  setTotalSteps: (steps: number) => void;
  /** The currently active step index, or null when the wizard is finished */
  currentStep: number | null;
  /** Go back to the previous step (if available) */
  goToPreviousStep: () => void;
  /** Go forward to the next step (if available) */
  goToNextStep: () => void;
  /** End the wizard and clear currentStep */
  finishStepper: () => void;
  /** Optional callback when the wizard is submitted */
  onSubmit?: () => void;
}

const StepperContext = createContext<StepperContextType | undefined>(undefined);

/**
 * Props for the WizardStepper component
 */
interface WizardStepperProps {
  /** The steps and navigation components as children */
  children: ReactNode;
  /** Callback function fired when the wizard is submitted */
  onSubmit?: () => void;
}

/**
 * WizardStepper provides step-by-step navigation with context.
 */
export default function WizardStepper({
  children,
  onSubmit,
}: WizardStepperProps) {
  const [currentStep, setCurrentStep] = useState<number | null>(0);
  const [totalSteps, setTotalSteps] = useState<number>(0);

  /** Navigate to the previous step */
  const goToPreviousStep = () => {
    setCurrentStep((step) => (step !== null && step > 0 ? step - 1 : step));
  };

  /** Navigate to the next step */
  const goToNextStep = () => {
    setCurrentStep((step) =>
      step !== null && step < totalSteps ? step + 1 : step
    );
  };

  /** Finish the stepper */
  const finishStepper = () => setCurrentStep(null);

  if (currentStep === null) return null;

  return (
    <StepperContext.Provider
      value={{
        totalSteps,
        setTotalSteps,
        currentStep,
        goToPreviousStep,
        goToNextStep,
        finishStepper,
        onSubmit,
      }}
    >
      {children}
    </StepperContext.Provider>
  );
}

/**
 * Custom hook to access stepper context.
 */
export function useStepper(): StepperContextType {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error("useStepper must be used within a WizardStepper");
  }
  return context;
}

/**
 * Props for navigation buttons
 */
interface NavigationButtonProps {
  /** Whether the button should show a loading state */
  isLoading?: boolean;
}

/**
 * Previous button for step navigation
 */
function PreviousButton({ isLoading }: NavigationButtonProps) {
  const { goToPreviousStep, currentStep } = useStepper();
  return (
    <Button
      onClick={goToPreviousStep}
      disabled={currentStep === 0 || isLoading}
      className="mr-auto"
    >
      previous
    </Button>
  );
}

/**
 * Props for the Next button
 */
interface NextButtonProps extends NavigationButtonProps {
  /** Whether the user can proceed to the next step */
  canProceed?: boolean;
  /** Callback fired when the button is clicked */
  onClick?: () => void;
}

/**
 * Next button for step navigation
 */
function NextButton({
  isLoading,
  canProceed = true,
  onClick,
}: NextButtonProps) {
  return (
    <Button
      onClick={() => {
        onClick?.();
      }}
      disabled={isLoading || !canProceed}
      className=" ml-auto"
    >
      next
    </Button>
  );
}

/**
 * Submit button to finalize the stepper
 */
function SubmitButton() {
  const { finishStepper, onSubmit } = useStepper();
  return (
    <Button
      onClick={() => {
        onSubmit?.();
        finishStepper();
      }}
      className="ml-auto"
    >
      finish
    </Button>
  );
}

/**
 * Props for StepList
 */
interface StepListProps {
  /** Array of Step components that represent each step */
  children: ReactElement[];
}

/**
 * StepList manages multiple Step components and tracks active step
 */
function StepList({ children }: StepListProps) {
  const { currentStep, setTotalSteps } = useStepper();
  const validChildren = children.filter(Boolean);

  useEffect(() => {
    setTotalSteps(validChildren.length - 1);
  }, [validChildren, setTotalSteps]);

  return validChildren.map((child, index) =>
    cloneElement(child, { key: index, isCurrent: index === currentStep })
  );
}

/**
 * Props for individual Step
 */
interface StepProps {
  /** Content of the step */
  children: ReactNode;
  /** Whether this step is the currently active one */
  isCurrent?: boolean;
  /** Whether the step is loading (shows a loader) */
  isLoading?: boolean;
  /** Whether the step completed successfully */
  isSuccess?: boolean;
  /** Whether navigation to the next step is allowed */
  canProceed?: boolean;
  /** Callback fired before moving to the next step */
  onNext?: () => void;
}

/**
 * Step represents a single step in the wizard
 */
function Step({
  children,
  isCurrent,
  isLoading,
  isSuccess,
  canProceed = true,
  onNext,
}: StepProps) {
  const { currentStep, totalSteps, goToNextStep } = useStepper();
  if (!isCurrent) return null;

  return (
    <div className="relative h-full w-full flex flex-col">
      {isLoading && (
        <div className="absolute left-0 top-0 h-fit w-full">
          <LineLoader />
        </div>
      )}
      <div className="h-full w-full grow">{children}</div>
      <div
        style={{ filter: "drop-shadow(rgba(0,0,0,0.3) 0px 0px 6px)" }}
        className="sticky px-4 rounded-b-2xl bottom-0 flex h-24 items-center border-t border-primary/50 w-full"
      >
        {currentStep != 0 && <PreviousButton isLoading={isLoading} />}
        {totalSteps !== currentStep ? (
          <NextButton
            isLoading={isLoading}
            canProceed={canProceed}
            onClick={() => {
              onNext?.();
              goToNextStep();
            }}
          />
        ) : (
          <SubmitButton />
        )}
      </div>
    </div>
  );
}

WizardStepper.StepList = StepList;
WizardStepper.Step = Step;
