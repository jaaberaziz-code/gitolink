import { OnboardingWizard } from '@/components/onboarding'

export const metadata = {
  title: 'Welcome to GitoLink - Setup Your Profile',
  description: 'Complete your GitoLink profile setup in a few simple steps.',
}

export default function OnboardingPage() {
  return <OnboardingWizard />
}
