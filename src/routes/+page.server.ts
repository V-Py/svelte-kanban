import { useCrdt } from '$stores';

// WebRTC doesn't work with SSR
export const ssr = !useCrdt;
