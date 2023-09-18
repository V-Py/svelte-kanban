import { useCrdt } from '$lib/stores';

// WebRTC doesn't work with SSR
export const ssr = !useCrdt;
