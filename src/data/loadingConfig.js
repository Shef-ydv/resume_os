// Configuration for Minimal Classic Loading Screen

export const LOADING_CONFIG = {
  // Texts - Strictly per design guidelines (Word "Portfolio" is forbidden)
  texts: {
    name: 'Shefali Yadav',
    role: 'Full Stack Developer',
    loadingText: 'Loading...',
    versionText: 'Resume OS v2.0'
  },

  // Timing Configuration (milliseconds) - Total ~2.8s
  timings: {
    totalDuration: 2800, // Total screen duration
    nameFadeDelay: 100, // Name fade & move up start
    underlineDelay: 600, // Accent underline draws outward
    roleFadeDelay: 1000, // Role text & blinking cursor fade in
    progressStartDelay: 1200, // Progress line starts filling
    progressDuration: 1500, // Duration of progress fill (from 1200ms to 2700ms)
    exitDuration: 600 // Exit fade-out and gentle scale-up
  }
};
