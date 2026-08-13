import { stopPreview } from './preview';

/** Leaves no daemon behind, so the port is free for the next run. */
export default function globalTeardown() {
  stopPreview();
}
