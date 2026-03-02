// Re-export our local API wrapper instead of Base44 SDK
// This provides a drop-in replacement for base44 SDK calls
import base44Wrapper from './index';
export const base44 = base44Wrapper;
