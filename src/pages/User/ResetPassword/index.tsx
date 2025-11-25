import PageLayout from "@/components/PageLayout";
import WizardStepper from "@/components/WizaredStepper";

const ResetPassword = () => {
  return (
    <PageLayout>
      <div className="w-full">
        <WizardStepper>
          <WizardStepper.StepList>
            <WizardStepper.Step canProceed={true}>Step 1</WizardStepper.Step>
            <WizardStepper.Step>Step 2</WizardStepper.Step>
          </WizardStepper.StepList>
        </WizardStepper>
      </div>
    </PageLayout>
  );
};

export default ResetPassword;
